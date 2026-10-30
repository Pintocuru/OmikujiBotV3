// src/editor/helpers/shared/useMappingUpdater.ts
import { ComputedRef } from 'vue'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { ScenarioStepType } from '@/types/OmikujiData'
import { FlowTarget } from '@/editor/helpers/CharacterChanger/composables/useDataExtractor'
import { useScenarioStepCharacters } from '@/editor/helpers/CharacterChanger/composables/useScenarioStepCharacters'

/**
 * マッピングを postFlow に適用する関数
 * (useScenarioStepCharacters の applyCharacterMappings / applyIconKeyMappings を渡す)
 */
type ApplyMappings = (flows: ScenarioStepType[], mappings: Record<string, string>) => ScenarioStepType[]

/**
 * マッピングの一括更新処理を提供(キャラクター変更・iconKey 変更で共用)
 */
export function useMappingUpdater(allTargets: ComputedRef<FlowTarget[]>, applyMappings: ApplyMappings) {
  const omikujiStore = useOmikujiStore()
  const { isTargetItem } = useScenarioStepCharacters()

  /**
   * マッピングを適用してアセットを更新
   */
  const applyMappingsToAllItems = (mappings: Record<string, string>) => {
    allTargets.value.forEach((target) => {
      if (target.category === 'scenarios') {
        omikujiStore.updateAsset('scenarios', target.item.key, {
          steps: applyMappings(target.item.steps, mappings),
        })
        return
      }

      // みくじ箱：postFlow 種別のアイテムのみ更新（weight・lottery などはそのまま保持）
      omikujiStore.updateAsset('mikuji', target.item.key, {
        omikuji: target.item.omikuji.map((omikuji) =>
          omikuji.kind === 'steps' && isTargetItem(target, omikuji.id)
            ? { ...omikuji, steps: applyMappings(omikuji.steps, mappings) }
            : omikuji
        ),
      })
    })
  }

  return { applyMappingsToAllItems }
}
