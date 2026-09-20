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
  // order プロパティを持つアイテムかどうかを判定
  // TODO:これ不要かも
  const hasOrderProperty = (item: unknown): item is { order: number } => {
    return (
      typeof item === 'object' &&
      item !== null &&
      'order' in item &&
      typeof (item as { order: unknown }).order === 'number'
    )
  }

  /**
   * 指定されたカテゴリの最大order値を取得
   */
  const getMaxOrder = (categoryData: Record<string, unknown>): number => {
    if (!categoryData || typeof categoryData !== 'object') return 0

    const orders = Object.values(categoryData)
      .filter(hasOrderProperty)
      .map((item) => item.order)

    return orders.length > 0 ? Math.max(...orders) : 0
  }

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
   * インポートデータのorder値を調整
   * 既存の最大order値を基準に連番を振り直す
   */
  const adjustOrderValues = <T extends Record<string, unknown>>(importItems: T, baseOrder: number): T => {
    if (!importItems || typeof importItems !== 'object') return importItems

    const result = {} as T
    let offset = 0

    for (const [key, item] of Object.entries(importItems)) {
      if (hasOrderProperty(item)) {
        offset++
        result[key as keyof T] = { ...item, order: baseOrder + offset } as T[keyof T]
      } else {
        result[key as keyof T] = item as T[keyof T]
      }
    }

    return result
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
    hasOrderProperty,
    getMaxOrder,
    adjustOrderValues,
    mergeCategoryData,
  }
}
