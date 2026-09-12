// src/ConfigMaker/stores/composables/useAssetCRUD.ts
import type { Ref } from 'vue'
import { AssetCategorySchemaMap, AssetCategoryType, AssetCategoryDataMap, OmikujiDataType } from '@/types/OmikujiData'

/**
 * Assetsの基本的なCRUD操作を提供
 */
export function useAssetCRUD(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  // Asset追加
  const addAsset = <C extends AssetCategoryType>(category: C, item: Partial<AssetCategoryDataMap[C]> = {}): string => {
    const schema = AssetCategorySchemaMap[category]
    const parseItem = { ...item }

    // keyの重複チェック
    if (typeof parseItem.key === 'string' && data.value.assets[category][parseItem.key]) {
      delete parseItem.key
    }

    // order値を自動設定
    const existingItems = Object.values(data.value.assets[category])
    const maxOrder = Math.max(0, ...existingItems.map((item) => item.order ?? 0))

    parseItem.order = maxOrder + 1
    parseItem.isEnabled = true

    const newItem = schema.parse(parseItem) as AssetCategoryDataMap[C]

    data.value.assets[category] = {
      ...data.value.assets[category],
      [newItem.key]: newItem,
    }

    hasChanged.value = true

    return newItem.key
  }

  // Asset更新
  const updateAsset = <C extends AssetCategoryType>(
    category: C,
    key: string,
    updates: Partial<AssetCategoryDataMap[C]>
  ) => {
    const categoryData = data.value.assets[category] as Record<string, AssetCategoryDataMap[C]>

    if (!categoryData?.[key]) return

    const updatedItem = {
      ...categoryData[key],
      ...updates,
      key,
      updatedAt: new Date().toISOString(),
    }

    data.value.assets[category] = {
      ...categoryData,
      [key]: updatedItem,
    } as (typeof data.value.assets)[C]

    hasChanged.value = true
  }

  // Asset削除
  const removeAsset = <C extends AssetCategoryType>(category: C, key: string) => {
    const categoryData = data.value.assets[category] as Record<string, AssetCategoryDataMap[C]>

    if (!categoryData?.[key]) return

    const { [key]: _deleted, ...remaining } = categoryData

    data.value.assets[category] = remaining as (typeof data.value.assets)[C]
    hasChanged.value = true
  }

  // Asset複製
  const duplicateAsset = <C extends AssetCategoryType>(category: C, key: string): string | null => {
    const categoryData = data.value.assets[category] as Record<string, AssetCategoryDataMap[C]>

    const item = categoryData?.[key]
    if (!item) return null

    const timestamp = new Date().toISOString()

    const duplicatedItem = {
      ...item,
      id: undefined,
      key: `${key.replace(/_copy_\d+$/, '')}_copy_${Date.now()}`,
      name: `${item.name}(コピー)`,
      createdAt: timestamp,
      updatedAt: timestamp,
    }

    return addAsset(category, duplicatedItem)
  }

  // AssetのKey変更
  const updateAssetKey = <C extends AssetCategoryType>(category: C, oldKey: string, newKey: string): boolean => {
    const categoryData = data.value.assets[category] as Record<string, AssetCategoryDataMap[C]>

    if (!categoryData?.[oldKey] || categoryData[newKey]) {
      return false
    }

    const item = categoryData[oldKey]

    const { [oldKey]: _removed, ...remaining } = categoryData

    const updatedItem = {
      ...item,
      key: newKey,
      updatedAt: new Date().toISOString(),
    }

    data.value.assets[category] = {
      ...remaining,
      [newKey]: updatedItem,
    } as (typeof data.value.assets)[C]

    hasChanged.value = true

    return true
  }

  // Assetカテゴリ全削除
  const clearAssets = <C extends AssetCategoryType>(category: C) => {
    data.value.assets[category] = {}
    hasChanged.value = true
  }

  return {
    addAsset,
    updateAsset,
    removeAsset,
    duplicateAsset,
    updateAssetKey,
    clearAssets,
  }
}
