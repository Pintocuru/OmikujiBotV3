// src/generator/stores/UserStats/UserStatsControlSync.test.ts
import { describe, expect, it } from 'vitest'
import { OmikenCommentSchema } from '@/types/OmikenComment'
import type { UserStatsControlType, UserStatsLoadResponseType } from '@/types/api'
import { UserStatsControlSync } from './UserStatsControlSync'
import { UserStatsManager } from './UserStatsManager'

const setup = () => {
  const manager = new UserStatsManager()
  const sync = new UserStatsControlSync(manager)
  const comment = (userId: string, userName = userId) =>
    manager.recordComment(OmikenCommentSchema.parse({ userId, userName, comment: 'こんにちは' }))
  return { manager, sync, comment }
}
const control = (override: Partial<UserStatsControlType> = {}): UserStatsControlType => ({
  rev: 1,
  updatedAt: 1,
  ...override,
})
const response = (
  users: Record<string, UserStatsControlType>,
  override: Partial<UserStatsLoadResponseType> = {}
): UserStatsLoadResponseType => ({ revision: 1, isFull: true, users, ...override })

describe('UserStatsControlSync', () => {
  it('コメント済みのユーザーに、score / team / order / tags / badges を反映する', () => {
    const { manager, sync, comment } = setup()
    comment('u1')
    sync.apply(response({ u1: control({ score: 30, team: 'info', order: 2, tags: ['vip'], badges: ['star'] }) }))

    expect(manager.get('u1')).toMatchObject({ score: 30, team: 'info', order: 2, tags: ['vip'], badges: ['star'] })
    expect(sync.revision).toBe(1)
  })

  it('まだコメントしていないユーザーの操作結果は持っておき、初めてコメントしたときに反映する', () => {
    const { manager, sync, comment } = setup()
    sync.apply(response({ u1: control({ score: 5 }) }))
    expect(manager.get('u1')).toBeNull()

    comment('u1')
    expect(manager.get('u1')?.score).toBe(5)
  })

  it('手動ユーザーは、コメントしなくても記録が作られる。削除すると消える', () => {
    const { manager, sync } = setup()
    sync.apply(response({ 'manual:a': control({ isManual: true, userName: 'ロム太', score: 10, team: 'error' }) }))
    expect(manager.get('manual:a')).toMatchObject({ userName: 'ロム太', score: 10, team: 'error', tc: 0 })

    sync.apply(response({ 'manual:a': control({ rev: 2, isManual: true, userName: 'ロム太', isRemoved: true }) }, { revision: 2, isFull: false }))
    expect(manager.get('manual:a')).toBeNull()
  })

  it('order が 0 なら、席順なしになる', () => {
    const { manager, sync, comment } = setup()
    comment('u1')
    sync.apply(response({ u1: control({ order: 3 }) }))
    expect(manager.get('u1')?.order).toBe(3)

    sync.apply(response({ u1: control({ rev: 2, order: 0 }) }, { revision: 2, isFull: false }))
    expect(manager.get('u1')?.order).toBeUndefined()
  })

  it('差分 (isFull: false) は、含まれるユーザーだけ更新し、他は変えない', () => {
    const { manager, sync, comment } = setup()
    comment('u1')
    comment('u2')
    sync.apply(response({ u1: control({ score: 1 }), u2: control({ score: 2 }) }))
    sync.apply(response({ u1: control({ rev: 2, score: 11 }) }, { revision: 2, isFull: false }))

    expect(manager.get('u1')?.score).toBe(11)
    expect(manager.get('u2')?.score).toBe(2)
    expect(sync.revision).toBe(2)
  })

  it('全件 (isFull) で含まれなくなったユーザーは、操作結果なしに戻る (リセット)', () => {
    const { manager, sync, comment } = setup()
    comment('u1')
    sync.apply(response({ u1: control({ score: 30, team: 'info', tags: ['vip'] }) }))
    sync.apply(response({}, { revision: 3 }))

    expect(manager.get('u1')).toMatchObject({ score: 0, team: null, tags: [] })
    expect(manager.get('u1')?.order).toBeUndefined()
  })

  it('UserStatsManager がリセットされても、restoreManualUsers で手動ユーザーが戻る。コメント由来の操作結果は、次のコメントで戻る', () => {
    const { manager, sync, comment } = setup()
    comment('u1')
    sync.apply(response({ u1: control({ score: 7 }), 'manual:a': control({ isManual: true, userName: 'ロム太', score: 3 }) }))

    manager.reset() // 配信開始 / クリア
    expect(manager.getAll()).toHaveLength(0)

    sync.restoreManualUsers()
    expect(manager.getAll().map((u) => u.userId)).toEqual(['manual:a'])
    expect(manager.get('manual:a')?.score).toBe(3)

    comment('u1')
    expect(manager.get('u1')?.score).toBe(7)
  })
})
