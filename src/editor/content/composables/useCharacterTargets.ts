// src/editor/content/composables/useCharacterTargets.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { FlowTarget } from '@/editor/helpers/CharacterChanger/composables/useDataExtractor'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useReferenceGraph } from './useReferenceGraph'

/**
 * 選択中のアイテム(Events / Assets)から、使用キャラクターの抽出対象となるシナリオを解決する。
 * イベント / みくじ箱 / シナリオ / プレースホルダーのどこから見ても「関係するシナリオ」の一覧になる。
 */
export const useCharacterTargets = () => {
  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { getAsset } = useGetAssetData()
  const { getEvent, isEventCategory } = useGetEventData()
  const { scenariosOfPlaceholder, parentPlaceholders, calledScenarios } = useReferenceGraph()

  /** シナリオの key 群を FlowTarget に変換する(重複と、存在しない key は除く) */
  const toScenarioTargets = (keys: Iterable<string>): FlowTarget[] =>
    [...new Set(keys)].flatMap((scenarioKey) => {
      const scenario = getAsset('scenarios', scenarioKey)
      return scenario ? [{ category: 'scenarios' as const, item: scenario }] : []
    })

  /** みくじ箱の steps アイテムが呼ぶシナリオ(呼び出し先も含む) */
  const scenarioKeysFromBox = (boxKey: string): string[] => {
    const box = getAsset('mikuji', boxKey)
    return (box?.omikuji ?? []).flatMap((item) =>
      item.kind === 'steps' && item.stepKey ? calledScenarios(item.stepKey).map((scenario) => scenario.key) : []
    )
  }

  /** プレースホルダーを(入れ子の上位も含めて)使っているシナリオと、その呼び出し先 */
  const scenarioKeysFromPlaceholder = (placeholderKey: string): string[] => {
    const placeholderKeys = new Set<string>([placeholderKey])
    const queue = [placeholderKey]
    while (queue.length) {
      const current = queue.pop()!
      for (const parent of parentPlaceholders(current)) {
        if (placeholderKeys.has(parent.key)) continue
        placeholderKeys.add(parent.key)
        queue.push(parent.key)
      }
    }
    return [...placeholderKeys].flatMap((key) =>
      scenariosOfPlaceholder(key).flatMap((scenario) => calledScenarios(scenario.key).map((called) => called.key))
    )
  }

  const allTargets = computed<FlowTarget[]>(() => {
    const category = selectedCategory.value
    const key = selectedItemKey.value
    if (!key) return []

    if (isEventCategory(category)) {
      const omikujiKey = getEvent(category, key)?.omikujiKey
      return omikujiKey ? toScenarioTargets(scenarioKeysFromBox(omikujiKey)) : []
    }
    if (category === 'mikuji') return toScenarioTargets(scenarioKeysFromBox(key))
    if (category === 'scenarios') return toScenarioTargets(calledScenarios(key).map((scenario) => scenario.key))
    if (category === 'placeholders') return toScenarioTargets(scenarioKeysFromPlaceholder(key))
    return []
  })

  return { allTargets }
}
