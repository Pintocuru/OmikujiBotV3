// src/ui/GameRanking/scripts/toGameLog.test.ts
import { describe, expect, it } from 'vitest'
import { BotMessageRankingSchema } from '@/types/generator'
import { toGameLog } from './toGameLog'
import { createStreamId } from './useGameLogSaver'

const ranking = (override: Record<string, unknown> = {}) =>
  BotMessageRankingSchema.parse({
    source: { eventKey: 'event1' },
    user: { userName: 'たろう', userId: 'u1' },
    label: '30点',
    score: 30,
    ...override,
  })

describe('BotMessageRankingSchema', () => {
  it('user と score は必須。userId が空のものは対象外', () => {
    expect(BotMessageRankingSchema.safeParse({ score: 30 }).success).toBe(false) // user なし
    expect(BotMessageRankingSchema.safeParse({ user: { userName: 'a', userId: 'u1' } }).success).toBe(false) // score なし
    expect(BotMessageRankingSchema.safeParse({ user: { userName: 'a', userId: '' }, score: 1 }).success).toBe(false)
  })

  it('listName / symbol / label は省略できる', () => {
    expect(ranking({ label: undefined })).toMatchObject({ type: 'ranking', listName: '', symbol: '', label: '' })
  })
})

describe('toGameLog', () => {
  it('GameLogSchema の形にする (userName と label(item) を入れる。flag は入れない)', () => {
    const log = toGameLog(ranking({ timestamp: '2026-10-22T12:00:00.000Z' }))
    expect(log).toMatchObject({
      userId: 'u1',
      userName: 'たろう',
      item: '30点',
      score: 30,
      createdAt: Date.parse('2026-10-22T12:00:00.000Z'),
    })
    expect(log).not.toHaveProperty('flag')
  })

  it('listName があれば userName に使い、label が空なら item を入れない', () => {
    const log = toGameLog(ranking({ listName: 'ゲスト', label: '' }))
    expect(log.userName).toBe('ゲスト')
    expect(log).not.toHaveProperty('item')
  })
})

describe('createStreamId', () => {
  it('YYYYMMDD-HHmm の形で、配信IDの規則 (英数字・_・-) に合う', () => {
    expect(createStreamId(new Date(2026, 9, 20, 21, 5))).toBe('20261020-2105')
  })
})
