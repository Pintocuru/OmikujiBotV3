// src/editor/helpers/IconKeyChanger/useIconKeyUpdater.ts
import { ComputedRef } from 'vue'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { FlowTarget } from '../../CharacterChanger/composables/useDataExtractor'
import { usePostActionCharacters } from '../../CharacterChanger/composables/usePostActionCharacters'

/**
 * iconKeyの一括更新処理を提供
 */
export function useIconKeyUpdater(allTargets: ComputedRef<FlowTarget[]>) {
  const omikujiStore = useOmikujiStore()
  const { applyIconKeyMappings } = usePostActionCharacters()

  /**
   * iconKeyマッピングを適用してアセットを更新
   */
  const applyMappingsToAllItems = (mappings: Record<string, string>) => {
    allTargets.value.forEach((target) => {
      if (target.category === 'actions') {
        omikujiStore.updateAsset('actions', target.item.key, {
          postFlows: applyIconKeyMappings(target.item.postFlows, mappings),
        })
        return
      }

      // みくじ箱：postFlow 種別のアイテムのみ更新
      omikujiStore.updateAsset('mikuji', target.item.key, {
        omikuji: target.item.omikuji.map((omikuji) =>
          omikuji.kind === 'postFlow'
            ? { ...omikuji, postFlows: applyIconKeyMappings(omikuji.postFlows, mappings) }
            : omikuji
        ),
      })
    })
  }

  return { applyMappingsToAllItems }
}
