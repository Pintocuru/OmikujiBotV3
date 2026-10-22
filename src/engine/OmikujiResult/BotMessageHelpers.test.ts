// src/engine/OmikujiResult/BotMessageHelpers.test.ts
import { describe, expect, it } from 'vitest'
import { createBotMessagesFromVariable } from './BotMessageHelpers'

const omiken = { userName: 'たろう', userId: 'u1' } as any

describe('createBotMessagesFromVariable: ランキング', () => {
  it('user と order があれば type ranking になる (表示は label、比較は score)', () => {
    const [message] = createBotMessagesFromVariable({ lists: { text: '大吉', order: 5, isVisible: true, isUnique: false } }, 1, omiken)
    expect(message).toMatchObject({ type: 'ranking', listName: 'たろう', label: '大吉', score: 5, user: { userId: 'u1' } })
  })

  it('lists.name があれば listName に使う', () => {
    const [message] = createBotMessagesFromVariable(
      { lists: { listName: 'ゲスト', symbol: '★', text: '10', order: 10, isVisible: true, isUnique: false } },
      1,
      omiken
    )
    expect(message).toMatchObject({ type: 'ranking', listName: 'ゲスト', symbol: '★' })
  })

  it('user がない (定期的なお知らせなど) 場合は ranking にならない', () => {
    const messages = createBotMessagesFromVariable({ lists: { text: '大吉', order: 5, isVisible: true, isUnique: false } }, 1)
    expect(messages.map((m) => m.type)).toEqual(['extra'])
  })

  it('order がない場合は ranking にならない', () => {
    const messages = createBotMessagesFromVariable({ lists: { text: '大吉', isVisible: true, isUnique: false } }, 1, omiken)
    expect(messages.map((m) => m.type)).toEqual(['extra'])
  })

  it('slots があれば、ranking とは別に slots だけの extra も作る', () => {
    const messages = createBotMessagesFromVariable({ lists: { text: '1', order: 1, isVisible: true, isUnique: false }, slots: { slot0: 'a' } }, 1, omiken)
    expect(messages.map((m) => m.type)).toEqual(['ranking', 'extra'])
  })
})
