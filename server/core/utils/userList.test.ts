// server/core/utils/userList.test.ts
import { describe, expect, it } from 'vitest'
import { UserStatsRecordSchema, type UserStatsControlType } from '@/types/api'
import { buildUserList } from './userList'

const user = (userId: string, userName: string, lastVisit: number, tc = 1) =>
  UserStatsRecordSchema.parse({ userId, userName, tc, lastVisit, score: 999 })
const control = (override: Partial<UserStatsControlType> = {}): UserStatsControlType => ({
  rev: 1,
  updatedAt: 1,
  ...override,
})

describe('buildUserList', () => {
  it('コメント由来のユーザーは、最後のコメントが新しい順。操作結果を合わせる', () => {
    const controls = new Map([['u1', control({ score: 30, team: 'info', order: 2, tags: ['vip'] })]])
    const list = buildUserList([user('u1', 'たろう', 100), user('u2', 'はなこ', 200, 5)], controls)

    expect(list.map((u) => u.userId)).toEqual(['u2', 'u1'])
    expect(list[1]).toMatchObject({ userName: 'たろう', score: 30, team: 'info', order: 2, tags: ['vip'], isManual: false })
    expect(list[0]).toMatchObject({ commentCount: 5, score: 0, team: null, order: null })
  })

  it('order が 0 のユーザーは、席順なし (null) になる', () => {
    const list = buildUserList([user('u1', 'たろう', 1)], new Map([['u1', control({ order: 0 })]]))
    expect(list[0].order).toBeNull()
  })

  it('コメント由来の score は使わない (サーバーの操作結果が正)', () => {
    expect(buildUserList([user('u1', 'たろう', 1)], new Map())[0].score).toBe(0)
  })

  it('手動ユーザーは、コメント由来のユーザーの後ろに入る。削除済みは含めない', () => {
    const controls = new Map([
      ['manual:b', control({ isManual: true, userName: 'ロム太', score: 5 })],
      ['manual:a', control({ isManual: true, userName: 'あお' })],
      ['manual:x', control({ isManual: true, userName: '消した人', isRemoved: true })],
    ])
    const list = buildUserList([user('u1', 'たろう', 1)], controls)

    expect(list.map((u) => u.userName)).toEqual(['たろう', 'あお', 'ロム太'])
    expect(list[2]).toMatchObject({ isManual: true, commentCount: 0, lastCommentAt: 0, score: 5 })
  })

  it('手動ユーザーではない操作結果 (コメント前のユーザーなど) は、リストに出さない', () => {
    const list = buildUserList([], new Map([['ghost', control({ score: 10 })]]))
    expect(list).toEqual([])
  })
})
