// src/ui/UserBoard/scripts/boardData.test.ts
import { describe, expect, it } from 'vitest'
import { UserStatsRecordSchema, type UserStatsRecord } from '@/types/api'
import { buildPreviewUsers, buildRanking, buildSeats, buildTeamBars } from './boardData'

const user = (userId: string, userName: string, override: Partial<UserStatsRecord> = {}) =>
  UserStatsRecordSchema.parse({ userId, userName, ...override })

const users = [
  user('u1', 'たろう', { score: 10, team: 'info', order: 2 }),
  user('u2', 'はなこ', { score: 30, team: 'info', order: 1 }),
  user('u3', 'じろう', { score: 30, team: 'error' }),
  user('u4', 'さぶろう', { score: 0, team: 'error', order: 0 }),
  user('u5', 'しろう', { score: -5 }),
]

describe('buildRanking', () => {
  it('得点が 0 でないユーザーを、得点の高い順に並べる。同点は同じ順位', () => {
    const rows = buildRanking(users, 10)
    expect(rows.map((r) => [r.rank, r.user.userName])).toEqual([
      [1, 'じろう'],
      [1, 'はなこ'],
      [3, 'たろう'],
      [4, 'しろう'],
    ])
  })
  it('limit で件数を絞る', () => {
    expect(buildRanking(users, 2)).toHaveLength(2)
  })
})

describe('buildTeamBars', () => {
  it('チームごとの合計と人数。合計が高い順で、一番高いチームの比率が 1', () => {
    const bars = buildTeamBars(users)
    expect(bars.map((b) => [b.team, b.totalScore, b.memberCount])).toEqual([
      ['info', 40, 2],
      ['error', 30, 2],
    ])
    expect(bars[0].ratio).toBe(1)
    expect(bars[1].ratio).toBeCloseTo(0.75)
  })
  it('チームがなければ空。0 点以下のチームも、バーが見える最低限の長さを持つ', () => {
    expect(buildTeamBars([user('x', 'x', { score: 5 })])).toEqual([])
    const bars = buildTeamBars([user('a', 'a', { team: 'info', score: 10 }), user('b', 'b', { team: 'error', score: -4 })])
    expect(bars[1].ratio).toBe(0.03)
  })
})

describe('buildSeats', () => {
  it('席順が 1 以上のユーザーだけを、席順の小さい順に並べる (0 や未設定は席順なし)', () => {
    expect(buildSeats(users, 10).map((s) => [s.order, s.user.userName])).toEqual([
      [1, 'はなこ'],
      [2, 'たろう'],
    ])
  })
  it('limit で件数を絞る', () => {
    expect(buildSeats(users, 1)).toHaveLength(1)
  })
})

describe('buildPreviewUsers', () => {
  it('3つのボードがすべて表示できるダミーを返す', () => {
    const preview = buildPreviewUsers()
    expect(buildRanking(preview, 30).length).toBeGreaterThan(0)
    expect(buildTeamBars(preview).length).toBeGreaterThan(0)
    expect(buildSeats(preview, 30).length).toBeGreaterThan(0)
  })
})
