// src/ConfigMaker/stores/composables/useAssetProperties.ts
import { Ref } from 'vue'
import {
  OmikujiDataType,
  AssetCategoryType,
  AssetCategoryDataMap,
  WeightValuesArraySchema,
  WeightValuesArrayType,
} from '@/types/OmikujiData'
import { useAssetCRUD } from './useAssetCRUD'

/**
 * Assets専用のプロパティ更新機能
 */
export function useAssetProperties(data: Ref<OmikujiDataType>, assetCRUD: ReturnType<typeof useAssetCRUD>) {
  const updateAssetProperty = <C extends AssetCategoryType, K extends keyof AssetCategoryDataMap[C]>(
    category: C,
    key: string,
    propertyKey: K,
    value: AssetCategoryDataMap[C][K]
  ) => {
    assetCRUD.updateAsset(category, key, {
      [propertyKey]: value,
    } as unknown as Partial<AssetCategoryDataMap[C]>)
  }

  // 特殊ケース: プレースホルダー値の更新
  const updatePlaceholderValues = (placeholderKey: string, rawValues: WeightValuesArrayType) => {
    if (data.value.assets.placeholders[placeholderKey]) {
      const parsedValues = WeightValuesArraySchema.parse(rawValues)
      updateAssetProperty('placeholders', placeholderKey, 'values', parsedValues)
    }
  }

  return {
    updateAssetProperty,
    updatePlaceholderValues,
  }
}
