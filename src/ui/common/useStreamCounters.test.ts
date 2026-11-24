// src/ui/common/useStreamCounters.test.ts
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { effectScope, ref } from 'vue'
import { DEAD_AIR_BUILTIN_COUNTER_KEYS, PROGRESS_COUNTER_KEYS } from '@/types/ui'
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
import { BUILTIN_COUNTER_KEYS, useStreamCounters } from './useStreamCounters'

const services = useAppStore()

const comment = (userId: string, tc: number, lc: number, giftPrice = 0) =>
  ({ userId, userName: userId, profileImage: '', timestamp: 1000 + lc, giftPrice, meta: { tc, lc, no: lc } }) as OmikenCommentType

const mount = (labels: Record<string, string> = {}) => {
  const variableLabelMap = ref(labels)
  const scope = effectScope()
  const result = scope.run(() => useStreamCounters(variableLabelMap))!
  return { ...result, variableLabelMap, scope }
}

beforeEach(() => {
  services.resetStreamData()
  services.reactionStats.reset()
  services.placeholderVariable.clear()
  services.serviceMetaStore._devSetMeta({ upVote: 34, viewer: 52, follower: 4567 })
})

describe('useStreamCounters', () => {
  it('最初の値が、setup の時点で入っている(マウントを待たない)', () => {
    const { counters } = mount()
    expect(counters.value.viewer).toBe(52)
    expect(counters.value.follower).toBe(4567)
    expect(Object.keys(counters.value).sort()).toEqual([...BUILTIN_COUNTER_KEYS].sort())
  })

  it('コメント・リアクション・メタ・配信リセットが、購読なしで反映される', () => {
    const { counters } = mount()

    services.streamStats.record(comment('a', 1, 1, 100))
    services.userStats.recordComment(comment('a', 1, 1, 100))
    services.reactionStats.record({ heart: 3 })
    services.serviceMetaStore._devSetMeta({ viewer: 80 })

    expect(counters.value).toMatchObject({
      lc: 1,
      syoken: 1,
      totalComments: 1,
      totalPrice: 100,
      commenter: 1,
      reaction: 3,
      viewer: 80,
    })

    services.resetStreamData()
    expect(counters.value).toMatchObject({ lc: 0, syoken: 0, totalComments: 0, totalPrice: 0, commenter: 0, reaction: 3 })
  })

  it('インスタンスが複数あっても、それぞれ最新の値を返す', () => {
    const a = mount()
    const b = mount()
    a.scope.stop()
    services.streamStats.record(comment('a', 1, 1))
    expect(b.counters.value.totalComments).toBe(1)
  })

  it('変数カウンター: 変数が変わると反映され、ラベルのキーを変えると追従する', () => {
    const { counters, variableLabelMap } = mount({ score: 'スコア' })
    expect(counters.value.score).toBe(0) // 未定義は 0

    services.placeholderVariable.getEvaluator().set('score', 7)
    expect(counters.value.score).toBe(7)

    services.placeholderVariable.getEvaluator().set('score', 'text') // 数値でないものは 0
    expect(counters.value.score).toBe(0)

    variableLabelMap.value = { other: 'ほか' }
    services.placeholderVariable.getEvaluator().set('other', 3)
    expect(counters.value.other).toBe(3)
    expect(counters.value.score).toBeUndefined()
  })

  it('変数カウンターは、組み込みカウンターと同じ名前でも、組み込みの値を上書きしない', () => {
    const { counters } = mount({ viewer: '同接(変数)' })
    services.placeholderVariable.getEvaluator().set('viewer', 9999)
    expect(counters.value.viewer).toBe(52)
  })
})

describe('カウンターのキー一覧', () => {
  it('DeadAir の組み込みカウンターのキーと、一致する', () => {
    expect([...DEAD_AIR_BUILTIN_COUNTER_KEYS].sort()).toEqual([...BUILTIN_COUNTER_KEYS].sort())
  })

  it('進捗ソース(LiverBingo など)のキーは、組み込みカウンターに含まれる', () => {
    for (const key of PROGRESS_COUNTER_KEYS) expect(BUILTIN_COUNTER_KEYS).toContain(key)
  })
})
