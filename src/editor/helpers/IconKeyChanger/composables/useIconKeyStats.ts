// src/editor/helpers/IconKeyChanger/composables/useIconKeyStats.ts
import { computed, ComputedRef } from 'vue'
import { FlowTarget } from '@/editor/helpers/CharacterChanger/composables/useDataExtractor'
import { usePostActionCharacters } from '@/editor/helpers/CharacterChanger/composables/usePostActionCharacters'

/**
 * iconKey使用状況の統計情報を提供
 */
export function useIconKeyStats(allTargets: ComputedRef<FlowTarget[]>) {
  const { getFlowGroups, extractInvalidIconKeyPairs, countIconKeyUsage } = usePostActionCharacters()

  // 全 PostFlow 配列
  const flowGroups = computed(() => allTargets.value.flatMap(getFlowGroups))

  /**
   * 不正な { characterKey, iconKey } ペアの一覧（重複なし）
   */
  const invalidIconKeyPairs = computed(() => {
    const seen = new Set<string>()
    const pairs: { characterKey: string; iconKey: string }[] = []

    flowGroups.value.forEach((flows) => {
      extractInvalidIconKeyPairs(flows).forEach((pair) => {
        const key = `${pair.characterKey}:${pair.iconKey}`
        if (!seen.has(key)) {
          seen.add(key)
          pairs.push(pair)
        }
      })
    })

    return pairs
  })

  /**
   * 各 "characterKey:iconKey" の使用箇所数
   */
  const iconKeyUsageCount = computed(() => {
    const counts: Record<string, number> = {}

    flowGroups.value.forEach((flows) => {
      Object.entries(countIconKeyUsage(flows)).forEach(([key, count]) => {
        counts[key] = (counts[key] || 0) + count
      })
    })

    return counts
  })

  /**
   * 不正iconKeyが存在するか
   */
  const hasInvalidIconKeys = computed(() => invalidIconKeyPairs.value.length > 0)

  /**
   * 不正iconKeyの件数
   */
  const invalidIconKeyCount = computed(() => invalidIconKeyPairs.value.length)

  return {
    invalidIconKeyPairs,
    iconKeyUsageCount,
    hasInvalidIconKeys,
    invalidIconKeyCount,
  }
}
