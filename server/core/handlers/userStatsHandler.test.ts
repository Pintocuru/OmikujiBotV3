// server/core/handlers/userStatsHandler.test.ts
import { beforeEach, describe, expect, it, vi } from 'vitest'

// ファイルシステムは、メモリ上の Map に差し替える
const files = new Map<string, string>()
vi.mock('@server/core/services/fileSystemService', () => ({
  loadFile: async (_dir: string, name: string) => {
    const text = files.get(name)
    if (text === undefined) throw Object.assign(new Error('not found'), { code: 'ENOENT' })
    return JSON.parse(text)
  },
  saveFile: async (_dir: string, name: string, text: string) => {
    files.set(name, text)
  },
  deleteFile: async () => {},
  getFileList: async () => [],
}))

// ハンドラーはモジュール内にキャッシュを持つので、テストごとに読み込み直す
const load = async () => {
  vi.resetModules()
  const handler = await import('./userStatsHandler')
  const service = await import('@server/core/services/userListService')
  const { OmikenCommentSchema } = await import('@/types/OmikenComment')
  return { handler, service, OmikenCommentSchema }
}
const data = (res: { data: unknown }) => res.data as any

describe('ユーザーリスト (load-users)', () => {
  beforeEach(() => files.clear())

  it('手動ユーザーを追加すると、リストに出る。userId は manual: で始まる', async () => {
    const { handler } = await load()
    const added = data(await handler.addManualUser({ userName: ' ロム太 ' }))
    expect(added.userId).toMatch(/^manual:/)

    const list = data(await handler.loadUsers())
    expect(list.users).toHaveLength(1)
    expect(list.users[0]).toMatchObject({ userId: added.userId, userName: 'ロム太', isManual: true, score: 0 })
  })

  it('名前が空なら追加できない', async () => {
    const { handler } = await load()
    expect((await handler.addManualUser({ userName: '   ' })).code).toBe(400)
  })

  it('手動ユーザーにも update-user-stats で得点・チームを付けられ、generator は load-user-stats で名前つきで受け取れる', async () => {
    const { handler } = await load()
    const { userId } = data(await handler.addManualUser({ userName: 'ロム太' }))
    await handler.updateUserStats({ updates: [{ userId, set: { team: 'error' }, addScore: 10 }] })

    expect(data(await handler.loadUsers()).users[0]).toMatchObject({ score: 10, team: 'error' })
    expect(data(await handler.loadUserStats('0')).users[userId]).toMatchObject({ userName: 'ロム太', isManual: true, score: 10 })
  })

  it('手動ユーザーを削除すると、リストから消える (差分取得では isRemoved で伝える)。手動以外は削除できない', async () => {
    const { handler } = await load()
    const { userId } = data(await handler.addManualUser({ userName: 'ロム太' }))
    await handler.updateUserStats({ updates: [{ userId: 'u1', addScore: 1 }] })

    expect((await handler.removeManualUser({ userId: 'u1' })).code).toBe(400)
    expect((await handler.removeManualUser({ userId })).code).toBe(200)

    expect(data(await handler.loadUsers()).users).toHaveLength(0)
    expect(data(await handler.loadUserStats('0')).users[userId].isRemoved).toBe(true)
  })

  it('コメントしたユーザーはリストに出る。リセットしても、操作結果と手動ユーザーは残る', async () => {
    const { handler, service, OmikenCommentSchema } = await load()
    service.recordUserComment(
      OmikenCommentSchema.parse({ userId: 'u1', userName: 'たろう', comment: 'こんにちは', meta: { tc: 3, no: 1 } })
    )
    await handler.updateUserStats({ updates: [{ userId: 'u1', addScore: 7 }] })
    await handler.addManualUser({ userName: 'ロム太' })

    const before = data(await handler.loadUsers()).users
    expect(before.map((u: any) => u.userName)).toEqual(['たろう', 'ロム太'])
    expect(before[0]).toMatchObject({ score: 7, commentCount: 3 })

    await handler.resetUsers()
    const after = data(await handler.loadUsers()).users
    expect(after.map((u: any) => u.userName)).toEqual(['ロム太'])

    // 同じユーザーが再びコメントすると、得点は残っている
    service.recordUserComment(OmikenCommentSchema.parse({ userId: 'u1', userName: 'たろう', comment: 'また来たよ', meta: { tc: 4, no: 1 } }))
    expect(data(await handler.loadUsers()).users.find((u: any) => u.userId === 'u1').score).toBe(7)
  })
})
