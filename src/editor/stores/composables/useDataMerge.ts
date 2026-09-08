// src/ConfigMaker/stores/composables/useDataMerge.ts
import { Ref } from 'vue'
import {
  assetCategory,
  eventCategory,
  EventCategoryType,
  OmikujiDataType,
  RecordCategoryType,
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

  /**
   * インポートされたデータを既存データにマージ
   * インポートデータにもマイグレーションを適用
   */
  const mergeDataSets = (importedRawData: unknown, preview: ImportPreview): boolean => {
    try {
      // インポートデータにマイグレーション&バリデーションを適用
      const importedData = normalizeData(importedRawData)

      let result: OmikujiDataType

      // 部分更新モード
      result = processPartialMerge(importedData, preview)

      // 成功トースト
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

  /**
   * 部分マージ処理
   */
  const processPartialMerge = (importedData: OmikujiDataType, preview: ImportPreview): OmikujiDataType => {
    const result: OmikujiDataType = structuredClone(data.value)

    // events
    const mergeEventCategory = <K extends EventCategoryType>(category: K) => {
      const config = preview.recordCategories[category]
      if (!config.enabled) return

      const currentItems = result.events[category]
      const importItems = importedData.events[category]

      const mergedItems = helpers.mergeEventCategoryData(currentItems, importItems, config.mode)

      result.events[category] = mergedItems
    }

    eventCategory.forEach(mergeEventCategory)

    // assets
    const mergeAssetCategory = <K extends RecordCategoryType>(category: K) => {
      const config = preview.recordCategories[category]
      if (!config.enabled) return

      const currentItems = result.assets[category]
      const importItems = importedData.assets[category]

      let adjustedImportItems = importItems

      if (config.mode === 'partial-merge') {
        const maxOrder = helpers.getMaxOrder(currentItems)
        adjustedImportItems = helpers.adjustOrderValues(importItems, maxOrder)
      }

      const mergedItems = helpers.mergeCategoryData(currentItems, adjustedImportItems, config.mode)

      result.assets[category] = mergedItems
    }

    assetCategory.forEach(mergeAssetCategory)

    return result
  }

  return {
    mergeDataSets,
  }
}
