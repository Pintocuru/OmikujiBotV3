// src/console/scripts/userConsole.test.ts
import { describe, expect, it } from 'vitest'
import { UserListItemSchema, type UserListItemType } from '@/types/api'
import { buildClearOrderUpdates, buildOrderUpdates, buildTeamTotals, chunkUpdates, filterUsers, sortUsers } from './userConsole'

const user = (userId: string, userName: string, override: Partial<UserListItemType> = {}) =>
  UserListItemSchema.parse({ userId, userName, ...override })

const users = [
  user('u1', 'たろう', { lastCommentAt: 100, score: 10, team: 'info', order: 3 }),
  user('u2', 'はなこ', { lastCommentAt: 300, score: 30, team: 'info', order: 1 }),
  user('u3', 'じろう', { lastCommentAt: 200, score: 20, team: 'error' }),
  user('manual:a', 'ロム太', { isManual: true, score: 5 }),
]

describe('sortUsers', () => {
  it('コメントが新しい順 (手動ユーザーは最後)', () => {
    expect(sortUsers(users, 'recent').map((u) => u.userId)).toEqual(['u2', 'u3', 'u1', 'manual:a'])
  })
  it('得点が高い順', () => {
    expect(sortUsers(users, 'score').map((u) => u.score)).toEqual([30, 20, 10, 5])
  })
  it('席順の小さい順 (未設定は最後)', () => {
    expect(sortUsers(users, 'order').map((u) => u.userId).slice(0, 2)).toEqual(['u2', 'u1'])
    expect(sortUsers(users, 'order').slice(2).map((u) => u.order)).toEqual([null, null])
  })
  it('元の配列は変えない', () => {
    const copy = [...users]
    sortUsers(users, 'name')
    expect(users).toEqual(copy)
  })
})

describe('filterUsers', () => {
  it('名前の一部で絞り込む (大文字小文字は区別しない)', () => {
    expect(filterUsers(users, { query: 'ろう', team: 'all' }).map((u) => u.userId)).toEqual(['u1', 'u3'])
    expect(filterUsers([user('x', 'Alice')], { query: 'ALI', team: 'all' })).toHaveLength(1)
  })
  it('チームで絞り込む。none はチームなし', () => {
    expect(filterUsers(users, { query: '', team: 'info' })).toHaveLength(2)
    expect(filterUsers(users, { query: '', team: 'none' }).map((u) => u.userId)).toEqual(['manual:a'])
  })
})

describe('buildTeamTotals', () => {
  it('メンバーがいるチームだけ、合計が高い順', () => {
    expect(buildTeamTotals(users)).toEqual([
      { team: 'info', totalScore: 40, memberCount: 2 },
      { team: 'error', totalScore: 20, memberCount: 1 },
    ])
  })
})

describe('buildOrderUpdates / chunkUpdates', () => {
  it('いまの並びを 1 から振る', () => {
    expect(buildOrderUpdates(users.slice(0, 2))).toEqual([
      { userId: 'u1', set: { order: 1 } },
      { userId: 'u2', set: { order: 2 } },
    ])
  })
  it('席順を外す更新 (order 0) は、席順があるユーザーだけに作る', () => {
    expect(buildClearOrderUpdates(users)).toEqual([
      { userId: 'u1', set: { order: 0 } },
      { userId: 'u2', set: { order: 0 } },
    ])
  })
  it('200件ごとに分ける', () => {
    expect(chunkUpdates(Array.from({ length: 450 }, (_, i) => i)).map((c) => c.length)).toEqual([200, 200, 50])
  })
})
