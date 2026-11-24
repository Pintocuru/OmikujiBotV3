// src/ui/game/DeadAir/composables/useDeadAirLogic.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { effectScope, nextTick, ref } from 'vue'
import { DeadAirSchema } from '@/types/ui'
import type { OmikenCommentType } from '@/types/OmikenComment'

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
import { useStreamCounters } from '@/ui/common/useStreamCounters'
import { useDeadAirLogic } from './useDeadAirLogic'

const services = useAppStore()

const comment = (userId: string, tc: number, lc: number) =>
  ({ userId, userName: userId, profileImage: '', timestamp: 1000 + lc, meta: { tc, lc, no: lc } }) as OmikenCommentType

const setup = (counterKey: string) => {
  const settings = ref(
    DeadAirSchema.parse({ initialMinutes: 5, eventRules: [{ counterKey, effect: 'timer', value: 1, threshold: 1 }] })
  )
  // onUnmounted をコンポーネントの外で呼ぶ警告は、このテストでは無関係
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  return effectScope().run(() => {
    const { counters } = useStreamCounters(ref({}))
    return useDeadAirLogic(settings, counters)
  })!
}

beforeEach(() => {
  vi.useFakeTimers()
  services.resetStreamData()
  services.serviceMetaStore._devSetMeta({ viewer: 52 })
})
afterEach(() => {
  vi.useRealTimers()
  vi.restoreAllMocks()
})

describe('useDeadAirLogic (useStreamCounters の counters で動かす)', () => {
  it('最初から入っている値(同接 52)を「増加」とみなして、効果を発動しない', async () => {
    const logic = setup('viewer')
    vi.advanceTimersByTime(10_000)
    await nextTick()
    expect(logic.formattedTime.value).toBe('04:50')
  })

  it('カウンターが増えたら、その分だけ効果が発動する(コメント・同接)', async () => {
    const byComment = setup('totalComments')
    vi.advanceTimersByTime(10_000)
    services.streamStats.record(comment('a', 1, 1))
    await nextTick()
    expect(byComment.formattedTime.value).toBe('05:00') // 04:50 + 1 分は、上限 05:00 で止まる

    const byViewer = setup('viewer')
    vi.advanceTimersByTime(10_000)
    services.serviceMetaStore._devSetMeta({ viewer: 53 })
    await nextTick()
    expect(byViewer.formattedTime.value).toBe('05:00')
  })

  it('メタ取得完了時の初期値は増加扱いせず、その後の増加は検知する', async () => {
    const settings = ref(
      DeadAirSchema.parse({
        initialMinutes: 5,
        initialLives: 3,
        eventRules: [{ counterKey: 'viewer', effect: 'life', value: 1, threshold: 1 }],
      })
    )
    const counters = ref({ viewer: 0 })
    const countersReady = ref(false)
    vi.spyOn(console, 'warn').mockImplementation(() => {})

    const logic = effectScope().run(() => useDeadAirLogic(settings, counters, undefined, countersReady))!

    counters.value.viewer = 52
    await nextTick()
    countersReady.value = true
    await nextTick()
    expect(logic.currentLives.value).toBe(3)

    counters.value.viewer = 53
    await nextTick()
    expect(logic.currentLives.value).toBe(4)
  })
})
