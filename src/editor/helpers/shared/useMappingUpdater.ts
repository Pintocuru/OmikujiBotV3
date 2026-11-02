// src/editor/helpers/shared/useMappingUpdater.ts
import { ComputedRef } from 'vue'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { ScenarioStepType, ScenarioType } from '@/types/OmikujiData'
import { FlowTarget } from '@/editor/helpers/CharacterChanger/composables/useDataExtractor'
import { useScenarioStepCharacters } from '@/editor/helpers/CharacterChanger/composables/useScenarioStepCharacters'

/**
 * マッピングをステップに適用する関数
 * (useScenarioStepCharacters の applyCharacterMappings / applyIconKeyMappings を渡す)
 */
type ApplyMappings = (steps: ScenarioStepType[], mappings: Record<string, string>) => ScenarioStepType[]

/**
 * マッピングの一括更新処理を提供(キャラクター変更・iconKey 変更で共用)
 */
export function useMappingUpdater(allTargets: ComputedRef<FlowTarget[]>, applyMappings: ApplyMappings) {
  const omikujiStore = useOmikujiStore()
  const { getTargetScenarios } = useScenarioStepCharacters()

  /**
   * マッピングを適用してアセットを更新
   */
  const applyMappingsToAllItems = (mappings: Record<string, string>) => {
    const scenarios = new Map<string, ScenarioType>()
    allTargets.value.forEach((target) => {
      getTargetScenarios(target).forEach((scenario) => scenarios.set(scenario.key, scenario))
    })

    scenarios.forEach((scenario) => {
      // applyMappings は配列の順序を保つので、位置で元の id に対応させて Record に戻す
      const original = Object.values(scenario.steps)
      const mapped = applyMappings(original, mappings)
      const steps: ScenarioType['steps'] = {}
      mapped.forEach((step, index) => {
        const id = original[index].id
        steps[id] = { ...step, id }
      })
      omikujiStore.updateAsset('scenarios', scenario.key, { steps })
    })
  }

  return { applyMappingsToAllItems }
}
