// src/editor/helpers/CharacterChanger/composables/useCharacterStats.ts
import { computed, ComputedRef } from 'vue'
import { FlowTarget } from './useDataExtractor'
import { useScenarioStepCharacters } from './useScenarioStepCharacters'
import { useCharacterLookup } from './useCharacterLookup'

/**
 * キャラクター使用状況の統計情報を提供
 */
export function useCharacterStats(allTargets: ComputedRef<FlowTarget[]>) {
  const { characterArray } = useCharacterLookup()
  const { getStepGroups, extractCharacterKeys, countCharacterUsage } = useScenarioStepCharacters()

  // 全ステップ配列
  const stepGroups = computed(() => allTargets.value.flatMap(getStepGroups))

  /**
   * 使用されている全キャラクターキー
   */
  const uniqueCharacterKeys = computed(() => {
    const keys = new Set<string>()
    stepGroups.value.forEach((steps) => extractCharacterKeys(steps).forEach((key) => keys.add(key)))
    return Array.from(keys)
  })

  /**
   * 各キャラクターの使用箇所数
   */
  const characterUsageCount = computed(() => {
    const counts: Record<string, number> = {}
    stepGroups.value.forEach((steps) => {
      Object.entries(countCharacterUsage(steps)).forEach(([key, count]) => {
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
