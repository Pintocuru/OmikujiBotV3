// src/editor/stores/composables/useDataMergeHelpers.ts
import type { OmikujiDataType, EventCategoryType, AssetCategoryType } from '@/types/OmikujiData'
import type { ImportMode } from '@/editor/types/helpers/presetsImportType'

// 実データ(配列 / Record)の型をカテゴリ名から引く
type EventsData = OmikujiDataType['events']
type AssetsData = OmikujiDataType['assets']
type EventCategoryData<C extends EventCategoryType> = EventsData[C]
type AssetCategoryData<C extends AssetCategoryType> = AssetsData[C]

/**
 * データマージ処理のヘルパー関数を提供
 */
export function useDataMergeHelpers() {
  /**
   * イベントカテゴリごとのデータマージ処理
   */
  const mergeEventCategoryData = <C extends EventCategoryType>(
    currentItems: EventCategoryData<C>,
    importItems: EventCategoryData<C>,
    mode: ImportMode
  ): EventCategoryData<C> => {
    switch (mode) {
      case 'full-replace':
      case 'partial-replace':
        return importItems

      case 'partial-merge':
        return [...currentItems, ...importItems] as EventCategoryData<C>

      default:
        return currentItems
    }
  }

  /**
   * アセットカテゴリごとのデータマージ処理
   */
  const mergeCategoryData = <C extends AssetCategoryType>(
    currentItems: AssetCategoryData<C>,
    importItems: AssetCategoryData<C>,
    mode: ImportMode
  ): AssetCategoryData<C> => {
    switch (mode) {
      case 'full-replace':
      case 'partial-replace':
        return importItems

      case 'partial-merge':
        // 同じ key がある場合はインポート側を優先
        return { ...currentItems, ...importItems }

      default:
        return currentItems
    }
  }

  return {
    mergeEventCategoryData,
    mergeCategoryData,
  }
}
