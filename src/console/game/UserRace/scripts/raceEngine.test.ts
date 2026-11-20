// src/console/game/UserRace/scripts/raceEngine.test.ts
import { describe, expect, it } from 'vitest'
import type { UserListItemType } from '@/types/api'
import {
  FINISH_GRACE_SECONDS,
  MAX_RACERS,
  RACE_SECONDS,
  buildGameLogs,
  createRace,
  createRng,
  getFinalRanking,
  getRanking,
  getResults,
  pickRacers,
  stepRace,
  type RaceState,
} from './raceEngine'

const user = (i: number, pinned = false): UserListItemType =>
  ({
    userId: `u${i}`,
    userName: `user${i}`,
    profileImage: '',
    isManual: false,
    commentCount: 0,
    lastCommentAt: 0,
    score: 0,
    team: null,
    order: null,
    pinned,
    tags: [],
    badges: [],
  }) as UserListItemType

const makeRace = (seed: number, count: number): RaceState => {
  const rng = createRng(seed)
  const users = Array.from({ length: count }, (_, i) => user(i))
  return createRace(pickRacers(users, rng), rng)
}

/** 終わるまで進める (dt はフレーム間隔) */
const run = (seed: number, count = 8, dt = 1 / 60): RaceState => {
  let state = makeRace(seed, count)
  let steps = 0
  while (!state.finished && steps < 60 * 120) {
    state = stepRace(state, dt)
    steps++
  }
  return state
}

describe('createRng', () => {
  it('同じ種なら、同じ並びになる', () => {
    const a = createRng(1)
    const b = createRng(1)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })
})

describe('pickRacers', () => {
  it('ピン留めが先頭で、最大人数まで、重複しない', () => {
    const users = Array.from({ length: 30 }, (_, i) => user(i, i === 25 || i === 27))
    const picked = pickRacers(users, createRng(3))
    expect(picked).toHaveLength(MAX_RACERS)
    expect(
      picked
        .slice(0, 2)
        .map((p) => p.userId)
        .sort()
    ).toEqual(['u25', 'u27'])
    expect(new Set(picked.map((p) => p.userId)).size).toBe(MAX_RACERS)
  })
})

describe('stepRace', () => {
  it('どの種でも、現実的な時間で終わり、1〜3位に 3/2/1 点が付く', () => {
    for (let seed = 1; seed <= 100; seed++) {
      const state = run(seed)
      expect(state.finished).toBe(true)
      expect(state.elapsed).toBeLessThan(RACE_SECONDS * 2.2 + FINISH_GRACE_SECONDS)
      expect(getResults(state).map((r) => [r.rank, r.points])).toEqual([
        [1, 3],
        [2, 2],
        [3, 1],
      ])
    }
  })

  it('位置は戻らず、1 を超えない', () => {
    let state = makeRace(9, 8)
    while (!state.finished) {
      const before = state.racers.map((r) => r.position)
      state = stepRace(state, 1 / 30)
      state.racers.forEach((r, i) => {
        expect(r.position).toBeGreaterThanOrEqual(before[i])
        expect(r.position).toBeLessThanOrEqual(1)
      })
    }
  })

  it('公平: 4 レーンの勝率が、ほぼ均等', () => {
    const wins = [0, 0, 0, 0]
    for (let seed = 1; seed <= 1000; seed++) wins[getRanking(run(seed, 4, 1 / 20))[0].racer.lane]++
    for (const w of wins) {
      expect(w).toBeGreaterThan((1000 / 4) * 0.75)
      expect(w).toBeLessThan((1000 / 4) * 1.25)
    }
  })

  it('フレームレートが違っても、ほぼ同じ結果になる', () => {
    let same = 0
    for (let seed = 1; seed <= 50; seed++) {
      const slow = getRanking(run(seed, 8, 1 / 30))[0].racer.userId
      const fast = getRanking(run(seed, 8, 1 / 120))[0].racer.userId
      if (slow === fast) same++
    }
    expect(same).toBeGreaterThan(45)
  })
})

describe('getFinalRanking', () => {
  it('走った全員に、1 から順に重複なく順位が付く', () => {
    expect(getFinalRanking(run(4)).map((r) => r.rank)).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })

  it('ゴールしていない人は、ゴールした人の後ろで、位置が先の順になる', () => {
    const state = makeRace(2, 4)
    const [a, b, c, d] = state.racers
    const partial: RaceState = {
      ...state,
      racers: [
        { ...a, position: 0.4 },
        { ...b, position: 1, finishedAt: 12.5 },
        { ...c, position: 0.9 },
        { ...d, position: 1, finishedAt: 11.2 },
      ],
    }
    expect(getFinalRanking(partial).map((r) => r.racer.userId)).toEqual([d.userId, b.userId, c.userId, a.userId])
  })
})

describe('buildGameLogs', () => {
  it('全員ぶんの記録を作る (ポイント 3/2/1/0、順位とタイムの表示、再送で同じ内容)', () => {
    const state = run(7)
    const logs = buildGameLogs(state, 'race-x', 5000)
    expect(logs).toHaveLength(8)
    expect(logs.map((l) => l.score)).toEqual([3, 2, 1, 0, 0, 0, 0, 0])
    expect(new Set(logs.map((l) => l.id)).size).toBe(8)
    expect(logs.every((l) => l.id.startsWith('race-x:') && l.createdAt === 5000)).toBe(true)
    expect(logs[0].item).toMatch(/^1位 \d+\.\d秒$/)
    expect(buildGameLogs(state, 'race-x', 5000)).toEqual(logs)
  })

  it('ゴールしていない人は、タイムなしの順位だけ', () => {
    const state = makeRace(2, 2)
    const [a, b] = state.racers
    const logs = buildGameLogs(
      {
        ...state,
        racers: [
          { ...a, position: 0.5 },
          { ...b, position: 1, finishedAt: 13 },
        ],
      },
      'r',
      1
    )
    expect(logs.map((l) => l.item)).toEqual(['1位 13.0秒', '2位'])
  })
})
