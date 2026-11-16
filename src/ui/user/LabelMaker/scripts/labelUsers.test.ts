// src/ui/user/LabelMaker/scripts/labelUsers.test.ts
import { describe, expect, it } from 'vitest'
import { buildLabelUsers, buildPreviewUsers, type LabelEntry } from './labelUsers'

const entry = (key: string, userId: string, userName = userId): LabelEntry => ({
  key,
  user: { userId, userName, profileImage: '', timestamp: 0 },
})

describe('buildLabelUsers', () => {
  const posted = [entry('m1', 'a'), entry('m2', 'b'), entry('m3', 'a'), entry('m4', 'c')]

  it('user: 同じユーザーは最後に届いた位置に 1 回だけ載せ、新しい順に並べる', () => {
    expect(buildLabelUsers(posted, 'user', 10).map((e) => e.key)).toEqual(['m4', 'm3', 'm2'])
  })

  it('draw: 届くたびに載せ、新しい順に並べる', () => {
    expect(buildLabelUsers(posted, 'draw', 10).map((e) => e.key)).toEqual(['m4', 'm3', 'm2', 'm1'])
  })

  it('limit: 新しい方から件数分だけ返す(user は重複を除いた件数で数える)', () => {
    expect(buildLabelUsers(posted, 'user', 2).map((e) => e.key)).toEqual(['m4', 'm3'])
    expect(buildLabelUsers(posted, 'draw', 2).map((e) => e.key)).toEqual(['m4', 'm3'])
  })

  it('userId が空のユーザーは、user でも重複排除しない', () => {
    const anonymous = [entry('m1', '', 'x'), entry('m2', '', 'y')]
    expect(buildLabelUsers(anonymous, 'user', 10).map((e) => e.user.userName)).toEqual(['y', 'x'])
  })

  it('limit が 0 以下なら空', () => {
    expect(buildLabelUsers(posted, 'draw', 0)).toEqual([])
  })

  it('元の配列を変更しない', () => {
    const copy = [...posted]
    buildLabelUsers(posted, 'user', 10)
    expect(posted).toEqual(copy)
  })
})

describe('buildPreviewUsers', () => {
  it('key が重複せず、user と draw で件数が変わるよう、重複したユーザーを含む', () => {
    const entries = buildPreviewUsers()
    expect(new Set(entries.map((e) => e.key)).size).toBe(entries.length)
    expect(buildLabelUsers(entries, 'draw', 100).length).toBeGreaterThan(buildLabelUsers(entries, 'user', 100).length)
  })
})
