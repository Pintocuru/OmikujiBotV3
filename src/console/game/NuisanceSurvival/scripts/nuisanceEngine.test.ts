// src/console/game/NuisanceSurvival/scripts/nuisanceEngine.test.ts
import { describe, expect, it } from 'vitest'
import { createDefaultConfig, type NuisanceConfigType } from './nuisanceConfig'
import { MAX_FOOTPRINT, MAX_SIZE_SCALE, STEP_SECONDS } from './nuisanceConstants'
import {
  advance,
  createGame,
  footprintOf,
  getContributionRanking,
  pushNeededOf,
  sizeScaleOf,
  type GameState,
  type GridSize,
  type Nuisance,
  type SpawnRequest,
} from './nuisanceEngine'
import { NO_INPUT } from './heroInput'
import { getNuisanceTraits, type NuisanceKind } from './nuisanceTraits'
import { createRng } from './rng'

const config = (overrides: Partial<NuisanceConfigType> = {}): NuisanceConfigType => ({
  ...createDefaultConfig(),
  ...overrides,
})

const spawn = (userId: string, atSeconds = 0): SpawnRequest => ({
  atSeconds,
  userId,
  userName: `name-${userId}`,
  profileImage: '',
})

/** 指定した種類になる userId を探す */
const findUserId = (kind: NuisanceKind, from = 0): string => {
  for (let i = from; i < from + 5000; i++) if (getNuisanceTraits(`u${i}`).kind === kind) return `u${i}`
  throw new Error(`no user for ${kind}`)
}

/** 種類が決まった邪魔者を 1 体、指定のマスに置いた状態にする */
const withNuisance = (
  state: GameState,
  userId: string,
  col: number,
  row: number,
  patch: Partial<Nuisance> = {}
): GameState => {
  const traits = getNuisanceTraits(userId)
  const nuisance: Nuisance = {
    id: state.nextId,
    userId,
    userName: `name-${userId}`,
    profileImage: '',
    traits,
    col,
    row,
    prevCol: col,
    prevRow: row,
    movedAt: 0,
    dirX: 1,
    dirY: 0,
    moveTimer: 1e9, // 勝手に動かない
    age: 0,
    pushed: 0,
    fuse: traits.fuseSeconds,
    ...patch,
  }
  return {
    ...state,
    nextId: state.nextId + 1,
    nuisances: [...state.nuisances, nuisance],
    contributions: {
      ...state.contributions,
      [userId]: state.contributions[userId] ?? {
        userId,
        userName: nuisance.userName,
        profileImage: '',
        damage: 0,
        spawned: 1,
      },
    },
  }
}

const run = (state: GameState, cfg: NuisanceConfigType, seconds: number, input = NO_INPUT, seed = 1) =>
  advance(state, cfg, seconds, input, [], createRng(seed)).state

describe('sizeScaleOf / footprintOf', () => {
  const traits = { ...getNuisanceTraits('a'), baseSize: 1 }

  it('倍率の間隔ごとに、設定の倍率が掛かる', () => {
    const cfg = config({ growthMultiplier: 2, growthIntervalSeconds: 10 })
    expect(sizeScaleOf({ age: 0, traits }, cfg)).toBeCloseTo(1)
    expect(sizeScaleOf({ age: 10, traits }, cfg)).toBeCloseTo(2)
    expect(sizeScaleOf({ age: 5, traits }, cfg)).toBeCloseTo(Math.SQRT2)
  })

  it('倍率 1 なら大きくならず、上限を超えない', () => {
    expect(sizeScaleOf({ age: 9999, traits }, config({ growthMultiplier: 1 }))).toBeCloseTo(1)
    expect(sizeScaleOf({ age: 9999, traits }, config({ growthMultiplier: 3 }))).toBe(MAX_SIZE_SCALE)
  })

  it('占めるマスは 1〜MAX_FOOTPRINT', () => {
    expect(footprintOf(0.8)).toBe(1)
    expect(footprintOf(1.4)).toBe(1)
    expect(footprintOf(1.5)).toBe(2)
    expect(footprintOf(99)).toBe(MAX_FOOTPRINT)
  })
})

describe('advance: 出現', () => {
  it('コメントが届いた時刻の刻みで、空いているマスに出る (主人公のマスには出ない)', () => {
    const cfg = config()
    const grid: GridSize = { cols: 3, rows: 3 }
    const state = createGame(cfg, grid)
    const { state: next, pending } = advance(state, cfg, 1, NO_INPUT, [spawn('x', 0.5), spawn('y', 5)], createRng(1))
    expect(next.nuisances.map((n) => n.userId)).toEqual(['x'])
    expect(pending.map((p) => p.userId)).toEqual(['y'])
    const n = next.nuisances[0]
    expect([n.col, n.row]).not.toEqual([next.hero.col, next.hero.row])
    expect(next.contributions.x.spawned).toBe(1)
  })

  it('上限を超えたコメントは無視する (出現数に数えない)', () => {
    const cfg = config({ maxNuisances: 2 })
    const state = createGame(cfg)
    const spawns = ['a', 'b', 'c', 'd'].map((id) => spawn(id))
    const next = advance(state, cfg, 0.1, NO_INPUT, spawns, createRng(2)).state
    expect(next.nuisances).toHaveLength(2)
    expect(next.ignoredCount).toBe(2)
    expect(next.contributions.c).toBeUndefined()
  })

  it('空きマスがなければ無視する', () => {
    const cfg = config({ maxNuisances: 50 })
    const grid: GridSize = { cols: 2, rows: 1 } // 主人公 1 マス + 空き 1 マス
    const next = advance(createGame(cfg, grid), cfg, 0.1, NO_INPUT, [spawn('a'), spawn('b')], createRng(3)).state
    expect(next.nuisances).toHaveLength(1)
    expect(next.ignoredCount).toBe(1)
  })

  it('同じユーザーが何度コメントしても、そのぶんだけ増える', () => {
    const cfg = config()
    const next = advance(createGame(cfg), cfg, 0.1, NO_INPUT, [spawn('a'), spawn('a'), spawn('a')], createRng(4)).state
    expect(next.nuisances.filter((n) => n.userId === 'a')).toHaveLength(3)
    expect(next.contributions.a.spawned).toBe(3)
  })
})

describe('advance: 追いつき (隠れていても止まらない)', () => {
  it('1 回で長い時間を進めても、細かく進めた結果と同じになる', () => {
    const cfg = config()
    const spawns = [spawn('a', 1), spawn('b', 3.3), spawn('c', 7)]
    const once = advance(createGame(cfg), cfg, 30, NO_INPUT, spawns, createRng(5))

    let state = createGame(cfg)
    let pending: SpawnRequest[] = spawns
    const rng = createRng(5)
    for (let t = 1; t <= 30; t++) {
      const r = advance(state, cfg, t, NO_INPUT, pending, rng)
      state = r.state
      pending = r.pending
    }
    expect(state.elapsed).toBeCloseTo(once.state.elapsed)
    expect(state.life).toBeCloseTo(once.state.life)
    expect(state.nuisances.map((n) => [n.userId, n.col, n.row])).toEqual(
      once.state.nuisances.map((n) => [n.userId, n.col, n.row])
    )
  })

  it('離席中にコメントが大量に届いてゲームオーバーになる。終了時刻は、ライフが 0 になった時刻', () => {
    const cfg = config({ startLife: 20, maxNuisances: 100, drainMultiplier: 5 })
    const spawns = Array.from({ length: 60 }, (_, i) => spawn(`user${i}`, 1 + (i % 5) * 0.2))
    const r = advance(createGame(cfg), cfg, 600, NO_INPUT, spawns, createRng(6))
    expect(r.state.over).toBe(true)
    expect(r.state.life).toBe(0)
    expect(r.state.endedAt).not.toBeNull()
    expect(r.state.endedAt!).toBeGreaterThan(1)
    expect(r.state.endedAt!).toBeLessThan(600)
    expect(r.state.elapsed).toBe(r.state.endedAt)
    expect(r.pending).toEqual([])
  })

  it('ゲームオーバーのあとは、何も変わらない', () => {
    const cfg = config({ startLife: 1, drainMultiplier: 10 })
    const over = advance(createGame(cfg), cfg, 60, NO_INPUT, [spawn('a'), spawn('b')], createRng(7)).state
    expect(over.over).toBe(true)
    expect(advance(over, cfg, 120, NO_INPUT, [spawn('c')], createRng(7)).state).toBe(over)
  })

  it('刻みの上限で止まったら、reachedStepLimit が立つ。続きを呼べば追いつく', () => {
    const cfg = config({ startLife: 1000 })
    const first = advance(createGame(cfg), cfg, 100, NO_INPUT, [], createRng(8), 100)
    expect(first.reachedStepLimit).toBe(true)
    expect(first.state.elapsed).toBeCloseTo(100 * STEP_SECONDS)
    const second = advance(first.state, cfg, 10, NO_INPUT, [], createRng(8), 1000)
    expect(second.reachedStepLimit).toBe(false)
    expect(second.state.elapsed).toBeCloseTo(10, 1)
  })

  it('元の state は変えない', () => {
    const cfg = config()
    const state = createGame(cfg)
    const snapshot = JSON.stringify(state)
    advance(state, cfg, 5, NO_INPUT, [spawn('a')], createRng(9))
    expect(JSON.stringify(state)).toBe(snapshot)
  })
})

describe('advance: ライフと貢献度', () => {
  it('邪魔者の数と大きさに応じて減る (大きいほど速い)', () => {
    const cfg = config({ growthMultiplier: 1 })
    const userId = findUserId('wanderer')
    const one = run(withNuisance(createGame(cfg), userId, 0, 0), cfg, 10)
    const two = run(withNuisance(withNuisance(createGame(cfg), userId, 0, 0), userId, 5, 5), cfg, 10)
    const lostOne = cfg.startLife - one.life
    const lostTwo = cfg.startLife - two.life
    expect(lostOne).toBeGreaterThan(0)
    expect(lostTwo).toBeCloseTo(lostOne * 2, 1)

    const grown = config({ growthMultiplier: 1 })
    const big = run(withNuisance(createGame(grown), userId, 0, 0, { age: 0 }), grown, 10)
    const growing = config({ growthMultiplier: 2, growthIntervalSeconds: 5 })
    const bigger = run(withNuisance(createGame(growing), userId, 0, 0), growing, 10)
    expect(growing.startLife - bigger.life).toBeGreaterThan(grown.startLife - big.life)
  })

  it('ゲームオーバーのとき、全員の貢献度の合計は、減らしたライフ (最大ライフ) に等しい', () => {
    const cfg = config({ startLife: 30, maxNuisances: 100, drainMultiplier: 4 })
    const spawns = Array.from({ length: 20 }, (_, i) => spawn(`user${i}`, 0.1))
    const state = advance(createGame(cfg), cfg, 300, NO_INPUT, spawns, createRng(10)).state
    expect(state.over).toBe(true)
    const sum = Object.values(state.contributions).reduce((s, c) => s + c.damage, 0)
    expect(sum).toBeCloseTo(cfg.startLife, 5)
  })

  it('貢献度の順位は、ダメージの多い順', () => {
    const cfg = config({ startLife: 30, maxNuisances: 100, drainMultiplier: 4 })
    const spawns = [...Array.from({ length: 8 }, (_, i) => spawn(`heavy${i}`, 0)), spawn('light', 0)]
    const state = advance(createGame(cfg), cfg, 300, NO_INPUT, spawns, createRng(11)).state
    const ranking = getContributionRanking(state)
    for (let i = 1; i < ranking.length; i++) expect(ranking[i - 1].damage).toBeGreaterThanOrEqual(ranking[i].damage)
  })
})

describe('advance: 爆発', () => {
  it('bomber は、時間が来ると消えて、大きなダメージを与える', () => {
    const cfg = config({ growthMultiplier: 1 })
    const userId = findUserId('bomber')
    const traits = getNuisanceTraits(userId)
    const fuse = traits.fuseSeconds!
    const before = withNuisance(createGame(cfg), userId, 0, 0)
    const mid = run(before, cfg, fuse - 1)
    expect(mid.nuisances).toHaveLength(1)
    const after = run(mid, cfg, fuse + 1)
    expect(after.nuisances).toHaveLength(0)
    expect(after.explodedCount).toBe(1)
    const lost = cfg.startLife - after.life
    expect(lost).toBeGreaterThan(traits.explosionDamage * 0.9)
    expect(after.contributions[userId].damage).toBeCloseTo(lost, 5)
  })
})

describe('advance: 主人公の移動と除去', () => {
  const grid: GridSize = { cols: 5, rows: 3 }

  it('キーを押している間、一定の間隔で 1 マスずつ動き、壁で止まる', () => {
    const cfg = config()
    const state = createGame(cfg, grid) // 主人公は (2, 1)
    const right = run(state, cfg, 0.5, { dx: 1, dy: 0 })
    expect(right.hero.col).toBeGreaterThan(2)
    const wall = run(state, cfg, 5, { dx: 1, dy: 0 })
    expect(wall.hero.col).toBe(4)
    const none = run(state, cfg, 5, NO_INPUT)
    expect([none.hero.col, none.hero.row]).toEqual([2, 1])
  })

  it('邪魔者にぶつかったまま押し続けると取り除ける。途中でやめると、押した時間は減る', () => {
    const cfg = config({ growthMultiplier: 1 })
    const userId = findUserId('wanderer')
    const base = withNuisance(createGame(cfg, grid), userId, 3, 1) // 主人公 (2,1) の右隣
    const need = pushNeededOf(base.nuisances[0], cfg)

    const partial = run(base, cfg, need * 0.5, { dx: 1, dy: 0 })
    expect(partial.nuisances).toHaveLength(1)
    expect(partial.hero.col).toBe(2) // 押している間は動けない
    expect(partial.nuisances[0].pushed).toBeGreaterThan(0)

    const released = run(partial, cfg, partial.elapsed + need, NO_INPUT)
    expect(released.nuisances[0].pushed).toBe(0)

    const done = run(base, cfg, need + 0.2, { dx: 1, dy: 0 })
    expect(done.nuisances).toHaveLength(0)
    expect(done.removedCount).toBe(1)
    expect(done.life).toBeLessThan(cfg.startLife) // 取り除くまでの間は減っている
  })

  it('大きい邪魔者ほど、取り除くのに時間がかかる (設定の倍率も効く)', () => {
    const cfg = config({ growthMultiplier: 1 })
    const userId = findUserId('wanderer')
    const small = withNuisance(createGame(cfg), userId, 0, 0).nuisances[0]
    const big = { ...small, age: 0, traits: { ...small.traits, baseSize: 2 } }
    expect(pushNeededOf(big, cfg)).toBeGreaterThan(pushNeededOf(small, cfg))
    expect(pushNeededOf(small, config({ growthMultiplier: 1, pushMultiplier: 2 }))).toBeCloseTo(
      pushNeededOf(small, cfg) * 2
    )
  })
})

describe('advance: 邪魔者の動き', () => {
  const grid: GridSize = { cols: 7, rows: 5 }
  const moveFast = { moveTimer: 0 }

  it('どの種類も、壁の外にも主人公のマスにも出ない', () => {
    const cfg = config({ startLife: 1e6, growthMultiplier: 1.2, growthIntervalSeconds: 5 })
    const kinds: NuisanceKind[] = ['wanderer', 'evader', 'bouncer', 'bomber']
    let state = createGame(cfg, grid)
    kinds.forEach((kind, i) => {
      state = withNuisance(state, findUserId(kind, i * 100), i, 0, { ...moveFast, fuse: null })
    })
    const rng = createRng(12)
    let pending: SpawnRequest[] = []
    for (let t = 1; t <= 60; t++) {
      const r = advance(state, cfg, t, { dx: t % 3 === 0 ? 1 : 0, dy: 0 }, pending, rng)
      state = r.state
      pending = r.pending
      for (const n of state.nuisances) {
        const f = footprintOf(sizeScaleOf(n, cfg))
        expect(n.col).toBeGreaterThanOrEqual(0)
        expect(n.row).toBeGreaterThanOrEqual(0)
        expect(n.col + f).toBeLessThanOrEqual(grid.cols)
        expect(n.row + f).toBeLessThanOrEqual(grid.rows)
      }
    }
  })

  it('evader は、主人公から遠ざかる', () => {
    const cfg = config({ growthMultiplier: 1, startLife: 1e6 })
    const userId = findUserId('evader')
    const state = withNuisance(createGame(cfg, grid), userId, 3, 2, { moveTimer: 0.01 }) // 主人公 (3,2) の隣へずらす
    const placed = { ...state, nuisances: [{ ...state.nuisances[0], col: 4, row: 2, prevCol: 4, prevRow: 2 }] }
    const after = run(placed, cfg, 6)
    const n = after.nuisances[0]
    expect(Math.abs(n.col - after.hero.col) + Math.abs(n.row - after.hero.row)).toBeGreaterThanOrEqual(2)
  })

  it('bouncer は、壁に当たると向きを変えて動き続ける', () => {
    const cfg = config({ growthMultiplier: 1, startLife: 1e6 })
    const userId = findUserId('bouncer')
    const state = withNuisance(createGame(cfg, grid), userId, 5, 0, { moveTimer: 0.01, dirX: 1, dirY: 0 })
    const interval = state.nuisances[0].traits.moveIntervalSeconds
    // 最初の 1 マスで右端 (col 6) に着き、次の移動で壁に当たって反対向きになる
    const atWall = run(state, cfg, 0.06)
    expect(atWall.nuisances[0].col).toBe(6)
    const bounced = run(state, cfg, 0.06 + interval * 1.5)
    expect(bounced.nuisances[0].dirX).toBe(-1)
    expect(bounced.nuisances[0].col).toBeLessThan(6)
  })
})

describe('決定性', () => {
  it('同じ乱数・同じコメントなら、同じ結果になる', () => {
    const cfg = config()
    const spawns = Array.from({ length: 10 }, (_, i) => spawn(`user${i}`, i * 0.7))
    const a = advance(createGame(cfg), cfg, 40, NO_INPUT, spawns, createRng(99)).state
    const b = advance(createGame(cfg), cfg, 40, NO_INPUT, spawns, createRng(99)).state
    expect(a).toEqual(b)
  })
})
