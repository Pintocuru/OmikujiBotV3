// src/editor/helpers/IconKeyChanger/composables/useIconKeyStats.ts
import { computed, ComputedRef } from 'vue'
import { FlowTarget } from '@/editor/helpers/CharacterChanger/composables/useDataExtractor'
import { useScenarioStepCharacters } from '@/editor/helpers/CharacterChanger/composables/useScenarioStepCharacters'

/**
 * iconKey使用状況の統計情報を提供
 */
export function useIconKeyStats(allTargets: ComputedRef<FlowTarget[]>) {
  const { getStepGroups, extractInvalidIconKeyPairs, countIconKeyUsage } = useScenarioStepCharacters()

  // 全ステップ配列
  const stepGroups = computed(() => allTargets.value.flatMap(getStepGroups))

  /**
   * 不正な { characterKey, iconKey } ペアの一覧（重複なし）
   */
  const invalidIconKeyPairs = computed(() => {
    const seen = new Set<string>()
    const pairs: { characterKey: string; iconKey: string }[] = []

    stepGroups.value.forEach((steps) => {
      extractInvalidIconKeyPairs(steps).forEach((pair) => {
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

    stepGroups.value.forEach((steps) => {
      Object.entries(countIconKeyUsage(steps)).forEach(([key, count]) => {
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
