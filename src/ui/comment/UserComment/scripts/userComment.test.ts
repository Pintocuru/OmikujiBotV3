// src/ui/comment/UserComment/scripts/userComment.test.ts
import { describe, expect, it } from 'vitest'
import type { BotMessageBubbleType } from '@/types/generator'
import { ANONYMOUS_NAME, anonymousId, resolveCommentName } from './userCommentName'
import { buildEntries } from './userCommentEntries'

const make = (id: string, origin?: { userName: string; userId: string; comment: string }) =>
  ({ id, origin, bubble: { message: `結果${id}` } }) as unknown as BotMessageBubbleType

describe('anonymousId', () => {
  it('同じ userId なら同じ ID、違えば別の ID', () => {
    expect(anonymousId('user-a')).toBe(anonymousId('user-a'))
    expect(anonymousId('user-a')).not.toBe(anonymousId('user-b'))
  })
  it('7 文字の英数字になる(空の userId でも)', () => {
    expect(anonymousId('user-a')).toMatch(/^[0-9a-z]{7}$/)
    expect(anonymousId('')).toMatch(/^[0-9a-z]{7}$/)
  })
})

describe('resolveCommentName', () => {
  const user = { userName: 'たろう', userId: 'u1' }
  it('userName: ユーザー名。空なら名無しさん', () => {
    expect(resolveCommentName(user, 'userName')).toBe('たろう')
    expect(resolveCommentName({ ...user, userName: '' }, 'userName')).toBe(ANONYMOUS_NAME)
  })
  it('anonymous: 名無しさん + ID(ユーザー名は出さない)', () => {
    const name = resolveCommentName(user, 'anonymous')
    expect(name).toBe(`${ANONYMOUS_NAME} ID:${anonymousId('u1')}`)
    expect(name).not.toContain('たろう')
  })
})

describe('buildEntries', () => {
  const origin = (n: number) => ({ userName: `u${n}`, userId: `id${n}`, comment: `コメント${n}` })

  it('origin のないメッセージは除く', () => {
    const entries = buildEntries([make('1', origin(1)), make('2'), make('3', origin(3))], {
      maxItems: 8,
      nameMode: 'userName',
    })
    expect(entries.map((e) => e.id)).toEqual(['1', '3'])
  })
  it('新しいものから maxItems 件を、古い順で返す', () => {
    const messages = [1, 2, 3, 4].map((n) => make(String(n), origin(n)))
    const entries = buildEntries(messages, { maxItems: 2, nameMode: 'userName' })
    expect(entries.map((e) => e.id)).toEqual(['3', '4'])
  })
  it('コメントと結果を取り出す', () => {
    const [entry] = buildEntries([make('1', origin(1))], { maxItems: 8, nameMode: 'userName' })
    expect(entry).toMatchObject({ name: 'u1', comment: 'コメント1', reply: '結果1' })
  })
})
