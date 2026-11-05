// src/editor/stores/composables/useDataMergeHelpers.ts
import type { OmikujiDataType, EventCategoryType, AssetCategoryType } from '@/types/OmikujiData'
import type { ImportMode } from '@/editor/types/helpers/types'
import { generateId } from '@/types/core'

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

      case 'partial-merge': {
        // events は id で識別するため、既存と重複する id は振り直す(同じデータを2回マージしても壊れない)
        const usedIds = new Set<string>((currentItems as ReadonlyArray<{ id: string }>).map((item) => item.id))
        const added = (importItems as ReadonlyArray<{ id: string }>).map((item) => {
          const id = usedIds.has(item.id) ? generateId() : item.id
          usedIds.add(id)
          return id === item.id ? item : { ...item, id }
        })
        return [...currentItems, ...added] as unknown as EventCategoryData<C>
      }

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
