// src/editor/content/composables/useCharacterTargets.ts
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import type { FlowTarget } from '@/editor/helpers/CharacterChanger/types'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useReferenceGraph } from '@/editor/helpers/referenceGraph/useReferenceGraph'

/**
 * 選択中のアイテム(Events / Assets)から、使用キャラクターの抽出対象となるシナリオを解決する。
 * イベント / みくじ箱 / シナリオ / プレースホルダーのどこから見ても「関係するシナリオ」の一覧になる。
 */
export const useCharacterTargets = () => {
  const { selectedCategory, selectedItemKey } = storeToRefs(useNavigationStore())
  const { getAsset } = useGetAssetData()
  const { getEvent, isEventCategory } = useGetEventData()
  const { scenariosOfBox, scenariosOfPlaceholder, ancestorPlaceholderKeys, calledScenarios } = useReferenceGraph()

  /** シナリオの key 群を FlowTarget に変換する(重複と、存在しない key は除く) */
  const toScenarioTargets = (keys: Iterable<string>): FlowTarget[] =>
    [...new Set(keys)].flatMap((scenarioKey) => {
      const scenario = getAsset('scenarios', scenarioKey)
      return scenario ? [{ category: 'scenarios' as const, item: scenario }] : []
    })

  /** シナリオと、その呼び出し先のシナリオの key */
  const withCalledKeys = (scenarioKey: string): string[] => calledScenarios(scenarioKey).map((called) => called.key)

  /** みくじ箱の steps アイテムが呼ぶシナリオ(呼び出し先も含む) */
  const scenarioKeysFromBox = (boxKey: string): string[] =>
    scenariosOfBox(boxKey).flatMap((scenario) => withCalledKeys(scenario.key))

  /** プレースホルダーを(入れ子の上位も含めて)使っているシナリオと、その呼び出し先 */
  const scenarioKeysFromPlaceholder = (placeholderKey: string): string[] =>
    ancestorPlaceholderKeys(placeholderKey).flatMap((key) =>
      scenariosOfPlaceholder(key).flatMap((scenario) => withCalledKeys(scenario.key))
    )

  const allTargets = computed<FlowTarget[]>(() => {
    const category = selectedCategory.value
    const key = selectedItemKey.value
    if (!key) return []

    if (isEventCategory(category)) {
      const mikujiKey = getEvent(category, key)?.mikujiKey
      return mikujiKey ? toScenarioTargets(scenarioKeysFromBox(mikujiKey)) : []
    }
    if (category === 'mikuji') return toScenarioTargets(scenarioKeysFromBox(key))
    if (category === 'scenarios') return toScenarioTargets(withCalledKeys(key))
    if (category === 'placeholders') return toScenarioTargets(scenarioKeysFromPlaceholder(key))
    return []
  })

  return { allTargets }
}
