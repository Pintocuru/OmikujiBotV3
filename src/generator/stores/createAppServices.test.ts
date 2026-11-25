// src/generator/stores/createAppServices.test.ts
// 画面に出す値が、Service の中でリアクティブな状態として持たれていること(正本は Service のみ)の確認。
// 「書き込みの経路 (Pinia のストア経由か、生のインスタンスか) によらず、読んでいる computed が更新される」ことを守る。
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { computed } from 'vue'
import { createPinia, defineStore, setActivePinia } from 'pinia'
import type { OmikenCommentType } from '@/types/OmikenComment'

vi.mock('@/common/AppEnv', async (importOriginal) => ({ ...(await importOriginal<object>()), isDev: true }))
vi.mock('@/sdk/post/PostOneComme', () => ({ postSystemMessage: vi.fn() }))
vi.mock('@/sdk/subscribe/GetServiceMeta', () => ({
  ServiceMetaWatcher: { getInstance: () => ({ fetchMeta: vi.fn() }) },
}))

import { createAppServices } from './createAppServices'

const services = createAppServices()
setActivePinia(createPinia())
const store = defineStore('createAppServices-test', () => services)()

const comment = (userId: string, tc: number, lc: number, giftPrice = 0) =>
  ({
    userId,
    userName: userId,
    profileImage: '',
    timestamp: 1000 + lc,
    giftPrice,
    meta: { tc, lc, no: lc },
  }) as OmikenCommentType

// 読み取り側は、ストア経由と生のインスタンスの両方で作る (どちらで読んでも追跡される)
const readers = <T>(read: (s: typeof services) => T) => {
  const viaStore = computed(() => read(store))
  const viaRaw = computed(() => read(services))
  return () => {
    expect(viaStore.value).toEqual(viaRaw.value)
    return viaStore.value
  }
}

beforeEach(() => {
  services.resetStreamData()
  services.reactionStats.reset()
  services.placeholderVariable.clear()
})

describe.each([
  ['生のインスタンスに書く', services],
  ['Pinia のストア経由で書く', store],
])('Service の値は、%s場合でも、読んでいる computed に反映される', (_label, writer) => {
  it('streamStats: コメントの記録とリセット', () => {
    const stats = readers((s) => s.streamStats.getStats())
    expect(stats()).toEqual({ liveComments: 0, totalComments: 0, syoken: 0, totalPrice: 0 })

    writer.streamStats.record(comment('a', 1, 1, 100))
    writer.streamStats.record(comment('a', 2, 2))
    expect(stats()).toEqual({ liveComments: 2, totalComments: 2, syoken: 1, totalPrice: 100 })

    writer.streamStats.reset()
    expect(stats()).toEqual({ liveComments: 0, totalComments: 0, syoken: 0, totalPrice: 0 })
  })

  it('userStats: コメント・更新・削除・リセット', () => {
    const count = readers((s) => s.userStats.getUniqueCount())
    const list = readers((s) => s.userStats.getAll().map((u) => `${u.userId}:${u.score}`))

    writer.userStats.recordComment(comment('a', 1, 1))
    writer.userStats.recordComment(comment('b', 1, 2))
    expect(count()).toBe(2)

    writer.userStats.update('a', { score: 5 })
    expect(list()).toEqual(['a:5', 'b:0'])

    writer.userStats.remove('b')
    expect(count()).toBe(1)

    writer.userStats.reset()
    expect(count()).toBe(0)
  })

  it('reactionStats: 記録とリセット', () => {
    const total = readers((s) => s.reactionStats.getGrandTotal())
    const hearts = readers((s) => s.reactionStats.getTotal(['heart']))

    writer.reactionStats.record({ heart: 3, smile: 2 })
    expect(total()).toBe(5)
    expect(hearts()).toBe(3)

    writer.reactionStats.reset()
    expect(total()).toBe(0)
  })

  it('serviceMetaStore: 現在値・ピーク・前回値', () => {
    const current = readers((s) => s.serviceMetaStore.getCurrent()?.viewer)
    const peak = readers((s) => s.serviceMetaStore.getPeak().viewer)

    writer.serviceMetaStore._devSetMeta({ viewer: 300 })
    expect(current()).toBe(300)
    expect(peak()).toBe(300)

    writer.serviceMetaStore._devSetMeta({ viewer: 10 })
    expect(current()).toBe(10)
    expect(peak()).toBe(300) // ピークは下がらない
  })

  it('placeholderVariable: 追加・変更・削除・全消去', () => {
    const value = readers((s) => s.placeholderVariable.getEvaluator().get('x'))
    const all = readers((s) => Object.fromEntries(s.placeholderVariable.getEvaluator()))

    writer.placeholderVariable.getEvaluator().set('x', 1)
    expect(value()).toBe(1)

    writer.placeholderVariable.getEvaluator().set('x', 2) // 既存のキーの値の変更
    expect(value()).toBe(2)
    expect(all()).toEqual({ x: 2 })

    writer.placeholderVariable.delete('x')
    expect(value()).toBeUndefined()

    writer.placeholderVariable.getEvaluator().set('y', 1)
    writer.placeholderVariable.clear()
    expect(all()).toEqual({})
  })

  it('resetStreamData: 配信統計とユーザー数が、同時に 0 へ戻る', () => {
    const snapshot = readers((s) => [s.streamStats.getStats().totalComments, s.userStats.getUniqueCount()])

    writer.streamStats.record(comment('a', 1, 1))
    writer.userStats.recordComment(comment('a', 1, 1))
    expect(snapshot()).toEqual([1, 1])

    writer.resetStreamData()
    expect(snapshot()).toEqual([0, 0])
  })
})
