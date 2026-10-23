// src/editor/helpers/CharacterChanger/composables/useCharacterUpdater.ts
import { ComputedRef } from 'vue'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { FlowTarget } from './useDataExtractor'
import { usePostActionCharacters } from './usePostActionCharacters'

/**
 * キャラクターの一括更新処理を提供
 */
export function useCharacterUpdater(allTargets: ComputedRef<FlowTarget[]>) {
  const omikujiStore = useOmikujiStore()
  const { applyCharacterMappings, isTargetItem } = usePostActionCharacters()

  /**
   * キャラクターマッピングを適用してアセットを更新
   */
  const applyMappingsToAllItems = (mappings: Record<string, string>) => {
    allTargets.value.forEach((target) => {
      if (target.category === 'actions') {
        omikujiStore.updateAsset('actions', target.item.key, {
          postFlows: applyCharacterMappings(target.item.postFlows, mappings),
        })
        return
      }

      // みくじ箱：postFlow 種別のアイテムのみ更新（weight・lottery などはそのまま保持）
      omikujiStore.updateAsset('mikuji', target.item.key, {
        omikuji: target.item.omikuji.map((omikuji) =>
          omikuji.kind === 'postFlow' && isTargetItem(target, omikuji.id)
            ? { ...omikuji, postFlows: applyCharacterMappings(omikuji.postFlows, mappings) }
            : omikuji
        ),
      })
    })
  }

  return {
    applyMappingsToAllItems,
  }
}
