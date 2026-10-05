// src/editor/stores/useGetAssetData.ts
import { storeToRefs } from 'pinia'
import { AssetCategoryDataMap, AssetCategoryType, CategoryType, assetCategory } from '@/types/OmikujiData'
import { useOmikujiStore } from './useOmikujiStore'

export function useGetAssetData() {
  const omikujiStore = useOmikujiStore()
  const { data } = storeToRefs(omikujiStore)

  // 単一アセット取得
  const getAsset = <K extends AssetCategoryType>(category: K, key: string): AssetCategoryDataMap[K] | undefined => {
    return data.value.assets[category][key] as AssetCategoryDataMap[K] | undefined
  }

  // カテゴリ内のアセット一覧
  const getAssets = <K extends AssetCategoryType>(category: K): Record<string, AssetCategoryDataMap[K]> => {
    return data.value.assets[category] as Record<string, AssetCategoryDataMap[K]>
  }

  // カテゴリ判定
  const isAssetCategory = (category: CategoryType): category is AssetCategoryType =>
    (assetCategory as readonly string[]).includes(category)

  // アセット存在確認
  const hasAsset = <K extends AssetCategoryType>(category: K, key: string): boolean => {
    return key in data.value.assets[category]
  }

  // アセット数
  const getAssetCount = (category: AssetCategoryType): number => {
    return Object.keys(data.value.assets[category]).length
  }

  return {
    getAsset,
    getAssets,
    isAssetCategory,
    hasAsset,
    getAssetCount,
  }
}
