// src/ui/GameRanking/scripts/toRankingMessage.test.ts
import { describe, expect, it } from 'vitest'
import { BotMessageExtraSchema } from '@/types/generator'
import { toGameLog, toRankingMessage } from './toRankingMessage'
import { createStreamId } from './useGameLogSaver'

const extra = (override: Record<string, unknown> = {}) =>
  BotMessageExtraSchema.parse({
    source: { eventKey: 'event1' },
    user: { userName: 'たろう', userId: 'u1' },
    lists: { text: '30点', order: 30 },
    ...override,
  })

describe('toRankingMessage', () => {
  it('score は lists.order、eventKey は source.eventKey から取る', () => {
    const message = toRankingMessage(extra())
    expect(message).toMatchObject({ eventKey: 'event1', score: 30, user: { userId: 'u1' } })
  })

  it('必要な項目が足りないメッセージは null', () => {
    expect(toRankingMessage(extra({ user: undefined }))).toBeNull() // user なし
    expect(toRankingMessage(extra({ user: { userName: 'a', userId: '' } }))).toBeNull() // userId が空
    expect(toRankingMessage(extra({ lists: { text: '30点' } }))).toBeNull() // order なし
    expect(toRankingMessage(extra({ source: undefined }))).toBeNull() // eventKey なし
  })
})

describe('toGameLog', () => {
  it('GameLogSchema の形にする (item / flag は入れない)', () => {
    const log = toGameLog(toRankingMessage(extra({ timestamp: '2026-10-22T12:00:00.000Z' }))!)
    expect(log).toMatchObject({ userId: 'u1', score: 30, createdAt: Date.parse('2026-10-22T12:00:00.000Z') })
    expect(log).not.toHaveProperty('item')
    expect(log).not.toHaveProperty('flag')
  })
})

describe('createStreamId', () => {
  it('YYYYMMDD-HHmm の形で、配信IDの規則 (英数字・_・-) に合う', () => {
    expect(createStreamId(new Date(2026, 9, 20, 21, 5))).toBe('20261020-2105')
  })
})
