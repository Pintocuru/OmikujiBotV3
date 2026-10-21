// src/editor/stores/composables/useAssetSort.ts
import { Ref } from 'vue'
import { AssetCategoryType, OmikujiDataType } from '@/types/OmikujiData'

/**
 * アセット(Record型)の並び替え機能を提供
 * Record 自体は順序を保証しないため、BaseRecordSchema.order を並び順として使う
 */
export function useAssetSort(data: Ref<OmikujiDataType>, hasChanged: Ref<boolean>) {
  const reorderAssets = (category: AssetCategoryType, orderedKeys: string[]) => {
    const record = data.value.assets[category] as Record<string, { order: number }>

    // 並び替え対象に含まれないものは、現在の order 順のまま末尾に残す
    const keySet = new Set(orderedKeys)
    const rest = Object.entries(record)
      .filter(([key]) => !keySet.has(key))
      .sort(([, a], [, b]) => a.order - b.order)
      .map(([key]) => key)

    // 1 始まりで振り直す(addAsset の maxOrder + 1 と整合)
    let changed = false
    ;[...orderedKeys.filter((key) => key in record), ...rest].forEach((key, index) => {
      const order = index + 1
      if (record[key].order === order) return
      record[key].order = order
      changed = true
    })

    if (changed) hasChanged.value = true
  }

  return { reorderAssets }
}
