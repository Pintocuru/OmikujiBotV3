// src/console/scripts/summarizeState.test.ts
import { describe, expect, it } from 'vitest'
import { GameStateSchema } from '@/types/api'
import { buildRanking, buildUserRows, formatStreamId, resolveUserNames } from './summarizeState'

const state = GameStateSchema.parse({
  eventKey: 'e1',
  userMap: {
    u1: { userId: 'u1', totalDraws: 2, totalPoints: 40, bestScore: 30 },
    u2: { userId: 'u2', totalDraws: 1, totalPoints: 50, bestScore: 50 },
  },
  logs: [
    { id: 'a', userId: 'u1', userName: '古い名前', score: 10, createdAt: 1000 },
    { id: 'b', userId: 'u2', userName: 'はなこ', score: 50, item: '大吉', createdAt: 2000 },
    { id: 'c', userId: 'u1', userName: 'たろう', score: 30, createdAt: 3000 },
  ],
})

describe('resolveUserNames', () => {
  it('いちばん新しいログの userName を使う', () => {
    expect(resolveUserNames(state.logs).get('u1')).toBe('たろう')
  })
})

describe('buildRanking', () => {
  it('高い順。label がなければ score を文字にする', () => {
    const rows = buildRanking(state, { sortOrder: 'high', unique: false })
    expect(rows.map((r) => [r.rank, r.userName, r.label])).toEqual([
      [1, 'はなこ', '大吉'],
      [2, 'たろう', '30'],
      [3, 'たろう', '10'],
    ])
  })

  it('低い順 / 新しい順', () => {
    expect(buildRanking(state, { sortOrder: 'low', unique: false })[0].score).toBe(10)
    expect(buildRanking(state, { sortOrder: 'new', unique: false })[0].logId).toBe('c')
  })

  it('unique: 1ユーザー1件 (高い順は自己ベスト) と limit', () => {
    const rows = buildRanking(state, { sortOrder: 'high', unique: true })
    expect(rows.map((r) => r.userId)).toEqual(['u2', 'u1'])
    expect(rows[1].score).toBe(30)
    expect(buildRanking(state, { sortOrder: 'high', unique: false, limit: 1 })).toHaveLength(1)
  })
})

describe('buildUserRows', () => {
  it('累計ポイントの多い順。名前はログから引く', () => {
    const rows = buildUserRows(state)
    expect(rows.map((r) => r.userName)).toEqual(['はなこ', 'たろう'])
    expect(rows[1]).toMatchObject({ totalDraws: 2, bestScore: 30, lastPlayedAt: 3000 })
  })

  it('userName が保存されていない古いログは userId を表示名にする', () => {
    const old = GameStateSchema.parse({
      userMap: { x: { userId: 'x', totalDraws: 1, totalPoints: 1, bestScore: 1 } },
      logs: [{ id: 'z', userId: 'x', score: 1 }],
    })
    expect(buildUserRows(old)[0].userName).toBe('x')
  })
})

describe('formatStreamId', () => {
  it('日時の形式なら読みやすくする', () => {
    expect(formatStreamId('20261020-2130')).toBe('2026/10/20 21:30')
    expect(formatStreamId('my-stream')).toBe('my-stream')
  })
})
