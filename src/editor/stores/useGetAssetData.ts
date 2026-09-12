// src/editor/stores/useGetAssetData.ts
import { storeToRefs } from 'pinia'
import type { AssetCategoryType, AssetCategoryDataMap } from '@/types/OmikujiData/assets'
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
    hasAsset,
    getAssetCount,
  }
}
