// src/ui/common/useProgressTracker.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { effectScope, nextTick } from 'vue'
import type { OmikenCommentType } from '@/types/OmikenComment'
import type { ProgressSourceType } from '@/types/ui'

vi.mock('@/common/AppEnv', async (importOriginal) => ({ ...(await importOriginal<object>()), isDev: true }))
vi.mock('@/sdk/post/PostOneComme', () => ({ postSystemMessage: vi.fn() }))
vi.mock('@/sdk/subscribe/GetServiceMeta', () => ({
  ServiceMetaWatcher: { getInstance: () => ({ fetchMeta: vi.fn() }) },
}))
vi.mock('@/generator/stores/useAppStore', async () => {
  const { createAppServices } = await import('@/generator/stores/createAppServices')
  const services = createAppServices()
  return { useAppStore: () => services }
})

import { useAppStore } from '@/generator/stores/useAppStore'
import { useProgressTracker } from './useProgressTracker'

const services = useAppStore()

const comment = (userId: string, tc: number, lc: number) =>
  ({ userId, userName: userId, profileImage: '', timestamp: 1000 + lc, meta: { tc, lc, no: lc } }) as OmikenCommentType

const mount = () => effectScope().run(() => useProgressTracker())!

const COMMENTS: ProgressSourceType = { type: 'counter', key: 'totalComments' }
const VIEWER: ProgressSourceType = { type: 'counter', key: 'viewer' }
const VARIABLE: ProgressSourceType = { type: 'variable', name: 'score' }

beforeEach(() => {
  services.resetStreamData()
  services.placeholderVariable.clear()
  services.serviceMetaStore._devSetMeta({ viewer: 52 })
})

describe('useProgressTracker', () => {
  it('基準を取ったあとの増加分が、タイマーを待たずに反映される', async () => {
    const tracker = mount()
    tracker.rebase([COMMENTS, VARIABLE, { type: 'manual' }])
    expect(tracker.values.value).toEqual([0, 0, 0])

    services.streamStats.record(comment('a', 1, 1))
    services.streamStats.record(comment('b', 1, 2))
    services.placeholderVariable.getEvaluator().set('score', 5)
    await nextTick()
    expect(tracker.values.value).toEqual([2, 5, 0])
  })

  it('同接は、基準のあとの最大値を、取りこぼさず拾う', async () => {
    const tracker = mount()
    tracker.rebase([VIEWER])

    services.serviceMetaStore._devSetMeta({ viewer: 200 })
    await nextTick()
    services.serviceMetaStore._devSetMeta({ viewer: 10 })
    await nextTick()
    expect(tracker.values.value).toEqual([200])
  })

  it('配信のリセットで値が減ったら、基準を 0 に戻す', async () => {
    const tracker = mount()
    services.streamStats.record(comment('a', 1, 1))
    services.streamStats.record(comment('a', 2, 2))
    tracker.rebase([COMMENTS])

    services.resetStreamData()
    await nextTick()
    services.streamStats.record(comment('b', 1, 1))
    await nextTick()
    expect(tracker.values.value).toEqual([1])
  })

  it('rebaseCell: 1 項目だけ、基準を取り直す', async () => {
    const tracker = mount()
    tracker.rebase([COMMENTS, COMMENTS])
    services.streamStats.record(comment('a', 1, 1))
    await nextTick()
    expect(tracker.values.value).toEqual([1, 1])

    tracker.rebaseCell(1, COMMENTS)
    expect(tracker.values.value).toEqual([1, 0])

    services.streamStats.record(comment('b', 1, 2))
    await nextTick()
    expect(tracker.values.value).toEqual([2, 1])
  })
})
