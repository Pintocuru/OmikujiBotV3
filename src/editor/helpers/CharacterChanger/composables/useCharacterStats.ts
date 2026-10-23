// src/editor/helpers/CharacterChanger/composables/useCharacterStats.ts
import { computed, ComputedRef } from 'vue'
import { FlowTarget } from './useDataExtractor'
import { usePostActionCharacters } from './usePostActionCharacters'
import { useCharacterLookup } from './useCharacterLookup'

/**
 * キャラクター使用状況の統計情報を提供
 */
export function useCharacterStats(allTargets: ComputedRef<FlowTarget[]>) {
  const { characterArray } = useCharacterLookup()
  const { getFlowGroups, extractCharacterKeys, countCharacterUsage } = usePostActionCharacters()

  // 全 PostFlow 配列
  const flowGroups = computed(() => allTargets.value.flatMap(getFlowGroups))

  /**
   * 使用されている全キャラクターキー
   */
  const uniqueCharacterKeys = computed(() => {
    const keys = new Set<string>()
    flowGroups.value.forEach((flows) => extractCharacterKeys(flows).forEach((key) => keys.add(key)))
    return Array.from(keys)
  })

  /**
   * 各キャラクターの使用箇所数
   */
  const characterUsageCount = computed(() => {
    const counts: Record<string, number> = {}
    flowGroups.value.forEach((flows) => {
      Object.entries(countCharacterUsage(flows)).forEach(([key, count]) => {
        counts[key] = (counts[key] || 0) + count
      })
    })
    return counts
  })

  /**
   * 未定義キャラクターの数
   */
  const invalidCharacterCount = computed(() => {
    const validKeys = new Set(characterArray.value.map((c) => c.key).filter((key) => key && key.trim() !== ''))
    return uniqueCharacterKeys.value.filter((key) => !validKeys.has(key)).length
  })

  /**
   * 未定義キャラクターが存在するか
   */
  const hasInvalidCharacters = computed(() => invalidCharacterCount.value > 0)

  return {
    uniqueCharacterKeys,
    characterUsageCount,
    invalidCharacterCount,
    hasInvalidCharacters,
  }
}
