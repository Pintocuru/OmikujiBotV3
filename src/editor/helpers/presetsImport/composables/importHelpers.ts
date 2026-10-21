// src/editor/helpers/presetsImport/composables/importHelpers.ts
import { CategoryImportConfig, ComponentImportConfig, ConflictInfo } from '@/editor/types'
import {
  AssetCategoryType,
  DataCategoryType,
  EventCategoryType,
  OmikujiDataType,
  UiKind,
  assetCategory,
  eventCategory,
  uiKinds,
} from '@/types/OmikujiData/'

// データを持つ全カテゴリ(Events + Assets)
const dataCategories: readonly DataCategoryType[] = [...eventCategory, ...assetCategory]

/**
 * カテゴリがイベントカテゴリかどうかを判定
 */
const isEventCategory = (category: DataCategoryType): category is EventCategoryType =>
  (eventCategory as readonly string[]).includes(category)

/**
 * アイテムの名前を取得
 */
export const getItemName = (item: unknown): string => {
  if (item && typeof item === 'object' && 'name' in item) {
    return (item as { name?: string }).name || ''
  }
  return ''
}

// events: 配列(item.key で識別) / assets: Record(key で識別)
const getItemMap = (data: OmikujiDataType, category: DataCategoryType): Record<string, unknown> => {
  if (isEventCategory(category)) {
    return Object.fromEntries((data.events[category] ?? []).map((item) => [item.key, item]))
  }
  return data.assets[category as AssetCategoryType] ?? {}
}

/**
 * レコードの競合をチェック
 */
export const checkRecordConflicts = (
  currentData: OmikujiDataType,
  importData: OmikujiDataType,
  category: DataCategoryType
): ConflictInfo[] => {
  const currentItems = getItemMap(currentData, category)
  const importItems = getItemMap(importData, category)

  return Object.keys(importItems)
    .filter((key) => key in currentItems)
    .map((key) => ({ key, name: getItemName(importItems[key]) }))
}

/**
 * カテゴリのプレビューを生成
 */
export const generateCategoryPreview = (currentData: OmikujiDataType, importData: OmikujiDataType) => {
  const recordCategories: Partial<Record<DataCategoryType, CategoryImportConfig>> = {}
  let totalItems = 0

  dataCategories.forEach((category) => {
    const importCount = Object.keys(getItemMap(importData, category)).length
    const conflicts = checkRecordConflicts(currentData, importData, category)
    totalItems += importCount
    recordCategories[category] = { enabled: true, mode: 'partial-merge', count: importCount, conflicts }
  })

  return {
    recordCategories: recordCategories as Record<DataCategoryType, CategoryImportConfig>,
    totalItems,
  }
}

/**
 * コンポーネントのプレビューを生成
 */
export const generateComponentPreview = (
  currentData: OmikujiDataType,
  importData: OmikujiDataType
): Record<UiKind, ComponentImportConfig> => {
  const componentConfigs: Partial<Record<UiKind, ComponentImportConfig>> = {}

  uiKinds.forEach((kind) => {
    if (currentData.ui.settings[kind] && importData.ui.settings[kind]) {
      componentConfigs[kind] = { enabled: true, useImported: false }
    }
  })

  return componentConfigs as Record<UiKind, ComponentImportConfig>
}
