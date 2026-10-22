// server/core/handlers/gameStateHandler.test.ts
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

import { appendGameLog } from './gameStateHandler'

const log = (id: string, userId: string, score: number) => ({ id, userId, score, createdAt: 1000 })
const saved = (streamId: string) => JSON.parse(files.get(`${streamId}.json`)!)

describe('appendGameLog', () => {
  beforeEach(() => files.clear())

  it('初回はファイルを作り、ログと統計を保存する', async () => {
    const res = await appendGameLog({ streamId: 's1', eventKey: 'e1', log: log('a', 'u1', 30) })
    expect(res.code).toBe(200)
    expect((res.data as any).appended).toBe(true)

    const file = saved('s1')
    expect(file.states.e1.logs).toHaveLength(1)
    expect(file.states.e1.userMap.u1).toMatchObject({ totalDraws: 1, totalPoints: 30, bestScore: 30, totalWins: 0 })
  })

  it('同じユーザーの2回目は統計を加算し、自己ベストは最大値を保つ', async () => {
    await appendGameLog({ streamId: 's1', eventKey: 'e1', log: log('a', 'u1', 30) })
    await appendGameLog({ streamId: 's1', eventKey: 'e1', log: log('b', 'u1', 10) })

    const stats = saved('s1').states.e1.userMap.u1
    expect(stats).toMatchObject({ totalDraws: 2, totalPoints: 40, bestScore: 30 })
  })

  it('同じ log.id は無視する', async () => {
    await appendGameLog({ streamId: 's1', eventKey: 'e1', log: log('a', 'u1', 30) })
    const res = await appendGameLog({ streamId: 's1', eventKey: 'e1', log: log('a', 'u1', 30) })

    expect((res.data as any).appended).toBe(false)
    expect(saved('s1').states.e1.logs).toHaveLength(1)
    expect(saved('s1').states.e1.userMap.u1.totalDraws).toBe(1)
  })

  it('eventKey ごとに state を分け、他の eventKey は残す', async () => {
    await appendGameLog({ streamId: 's1', eventKey: 'e1', log: log('a', 'u1', 30) })
    await appendGameLog({ streamId: 's1', eventKey: 'e2', log: log('b', 'u1', 5) })

    const { states } = saved('s1')
    expect(Object.keys(states).sort()).toEqual(['e1', 'e2'])
    expect(states.e1.logs).toHaveLength(1)
    expect(states.e2.logs).toHaveLength(1)
  })

  it('並行して追記しても、取りこぼさない', async () => {
    await Promise.all(
      Array.from({ length: 20 }, (_, i) => appendGameLog({ streamId: 's1', eventKey: 'e1', log: log(`id${i}`, 'u1', 1) }))
    )
    const state = saved('s1').states.e1
    expect(state.logs).toHaveLength(20)
    expect(state.userMap.u1.totalDraws).toBe(20)
  })

  it('userId が __proto__ でもプロトタイプを汚染しない', async () => {
    await appendGameLog({ streamId: 's1', eventKey: 'e1', log: log('a', '__proto__', 1) })
    expect(({} as any).totalDraws).toBeUndefined()
    expect(Object.keys(saved('s1').states.e1.userMap)).toEqual(['__proto__'])
  })

  it('不正なリクエストは 400', async () => {
    expect((await appendGameLog({ streamId: '../x', eventKey: 'e1', log: log('a', 'u1', 1) })).code).toBe(400)
    expect((await appendGameLog({ streamId: 's1', eventKey: '', log: log('a', 'u1', 1) })).code).toBe(400)
    expect((await appendGameLog({ streamId: 's1', eventKey: 'e1', log: { id: 'a' } })).code).toBe(400)
  })
})
