// src/editor/stores/composables/useDataMerge.ts
import { Ref } from 'vue'
import {
  assetCategory,
  AssetCategoryType,
  eventCategory,
  EventCategoryType,
  OmikujiDataType,
} from '@/types/OmikujiData'
import { useDataMergeHelpers } from './useDataMergeHelpers'
import { ImportPreview } from '@/editor/types'
import { normalizeData } from '@/common/migrations'
import { swalModal, swalToast } from '@/common/SweetAlert2/SweetAlert2Toast'

/**
 * データマージ機能
 */
export function useDataMerge(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  const helpers = useDataMergeHelpers()

  // インポートされたデータを既存データにマージ
  const mergeDataSets = (importedRawData: unknown, preview: ImportPreview): boolean => {
    try {
      // インポートデータにマイグレーション&バリデーションを適用
      const importedData = normalizeData(importedRawData)

      const result = processPartialMerge(importedData, preview)

      swalToast.success({ title: 'データの部分更新が完了しました。' })

      data.value = result
      hasChanged.value = true
      return true
    } catch (error) {
      swalModal.error({
        title: 'データの更新中にエラーが発生しました',
        text: String(error),
      })
      console.error('Merge error:', error)
      return false
    }
  }

  // 部分マージ処理
  const processPartialMerge = (importedData: OmikujiDataType, preview: ImportPreview): OmikujiDataType => {
    const result: OmikujiDataType = structuredClone(data.value)

    // events
    const mergeEventCategory = <K extends EventCategoryType>(category: K) => {
      const config = preview.recordCategories[category]
      if (!config.enabled) return

      const currentItems = result.events[category]
      const importItems = importedData.events[category]

      result.events[category] = helpers.mergeEventCategoryData<K>(currentItems, importItems, config.mode)
    }
    eventCategory.forEach(mergeEventCategory)

    // assets
    const mergeAssetCategory = <K extends AssetCategoryType>(category: K) => {
      const config = preview.recordCategories[category]
      if (!config.enabled) return

      const currentItems = result.assets[category]
      let importItems = importedData.assets[category]

      if (config.mode === 'partial-merge') {
        const maxOrder = helpers.getMaxOrder(currentItems)
        importItems = helpers.adjustOrderValues(importItems, maxOrder)
      }

      result.assets[category] = helpers.mergeCategoryData<K>(currentItems, importItems, config.mode)
    }
    assetCategory.forEach(mergeAssetCategory)

    return result
  }

  return { mergeDataSets }
}
