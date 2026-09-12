// src/editor/stores/useOmikujiStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { OmikujiDataSchema, OmikujiDataType } from '@/types/OmikujiData/'
import { useDataIO } from './composables/useDataIO'
import { useDataMerge } from './composables/useDataMerge'
import { useAssetCRUD } from './composables/useAssetCRUD'
import { useEventCRUD } from './composables/useEventCRUD'
import { useRecordSort } from './composables/useRecordSort'
import { useSettingsOperations } from './composables/useSettingsOperations'
import { DataSource } from '@/editor/types'
import { useEventProperties } from './composables/useEventProperties'
import { useAssetProperties } from './composables/useAssetProperties'

/**
 * おみくじデータの中心的なstore
 */
export const useOmikujiStore = defineStore('omikuji', () => {
  // コアデータ
  const data = ref<OmikujiDataType>(OmikujiDataSchema.parse({}))

  // 変更追跡
  const hasChanged = ref(false)
  const resetChangeState = () => (hasChanged.value = false)

  // 読み込んだデータの種類
  const dataSource = ref<DataSource>('unknown')

  // データIO・マージ
  const dataIO = useDataIO(data, dataSource)
  const dataMerge = useDataMerge(data, hasChanged)

  // Assets操作
  const eventCRUD = useEventCRUD(data, hasChanged)
  const assetCRUD = useAssetCRUD(data, hasChanged)

  const eventProperties = useEventProperties(data, eventCRUD)
  const assetProperties = useAssetProperties(data, assetCRUD)

  // 並び替え
  const recordSort = useRecordSort(data, hasChanged)

  // 設定操作
  const settingsOps = useSettingsOperations(data, hasChanged)

  return {
    // コアデータ
    data,
    hasChanged,
    resetChangeState,
    dataSource,

    // データIO・マージ
    ...dataIO,
    ...dataMerge,

    // Events操作
    ...eventCRUD,
    ...eventProperties,

    // Assets操作
    ...assetCRUD,
    ...assetProperties,

    // その他
    ...recordSort,
    ...settingsOps,
  }
})
