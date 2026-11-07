// src/types/generator/scripts/BotMessageRankingSchema.test.ts
import { describe, expect, it } from 'vitest'
import { toRankingEntry } from '@/types/generator/scripts/BotMessageRankingSchema'
import type { BotMessageType } from '@/types/generator/scripts/BotMessageSchema'

const createMessage = (score: unknown): BotMessageType => ({
  id: 'msg-1',
  timestamp: Date.now(),
  delaySeconds: 0,
  uiKey: 'gameRanking',
  user: {
    userId: 'user-1',
    userName: 'Tester',
  },
  slots: {
    slot4: score as any,
  },
})

describe('toRankingEntry', () => {
  it('有効な数値を score として受け付ける', () => {
    const entry = toRankingEntry(createMessage(100))
    expect(entry).not.toBeNull()
    expect(entry?.slots.score).toBe(100)

    const zeroEntry = toRankingEntry(createMessage(0))
    expect(zeroEntry).not.toBeNull()
    expect(zeroEntry?.slots.score).toBe(0)

    const negativeEntry = toRankingEntry(createMessage(-10))
    expect(negativeEntry).not.toBeNull()
    expect(negativeEntry?.slots.score).toBe(-10)
  })

  it('数値文字列を数値に変換して受け付ける', () => {
    const entry = toRankingEntry(createMessage('250'))
    expect(entry).not.toBeNull()
    expect(entry?.slots.score).toBe(250)

    const zeroStringEntry = toRankingEntry(createMessage('0'))
    expect(zeroStringEntry).not.toBeNull()
    expect(zeroStringEntry?.slots.score).toBe(0)

    const spaceStringEntry = toRankingEntry(createMessage('  42  '))
    expect(spaceStringEntry).not.toBeNull()
    expect(spaceStringEntry?.slots.score).toBe(42)
  })

  it('空文字や空白文字列は除外して null を返す', () => {
    expect(toRankingEntry(createMessage(''))).toBeNull()
    expect(toRankingEntry(createMessage('   '))).toBeNull()
  })

  it('boolean値 (true/false) は除外して null を返す', () => {
    expect(toRankingEntry(createMessage(true))).toBeNull()
    expect(toRankingEntry(createMessage(false))).toBeNull()
  })

  it('数値に変換できない文字列や不正な値は除外して null を返す', () => {
    expect(toRankingEntry(createMessage('abc'))).toBeNull()
    expect(toRankingEntry(createMessage(Number.NaN))).toBeNull()
    expect(toRankingEntry(createMessage(null))).toBeNull()
    expect(toRankingEntry(createMessage(undefined))).toBeNull()
  })
})

