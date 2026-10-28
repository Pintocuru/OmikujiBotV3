// src/generator/stores/useAppStore.ts
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { OmikujiDataType } from '@/types/OmikujiData'
import { useAppStatus } from './useAppStatus'
import { useBotMessageActions } from './useBotMessageActions'
import { createAppServices } from './createAppServices'
import { isOmikujiDataLike, normalizeData } from '@/common/migrations/index'
import { useOmikensActions } from './useOmikensActions'

// グローバルデータの初期化
// omikujiData.js が無い・読めない場合は初期データで起動し、hasData=false のまま画面でエラーを伝える
const { omikujiData: rawOmikujiData } = window
let initialHasData = isOmikujiDataLike(rawOmikujiData)
let initialDataError: string | null = null
let omikujiData: OmikujiDataType
try {
  omikujiData = normalizeData(rawOmikujiData)
} catch (error) {
  console.error('omikujiData.js の読み込みに失敗:', error)
  initialHasData = false
  initialDataError = error instanceof Error ? error.message : String(error)
  omikujiData = normalizeData(undefined)
}

export const useAppStore = defineStore('app', () => {
  // ref
  const data = ref<OmikujiDataType>(omikujiData)

  // 実データ(omikujiData.js またはサーバー)を読み込めているか
  const hasData = ref(initialHasData)
  const dataErrorDetail = ref<string | null>(initialDataError)

  // データを更新
  const loadData = (newData: OmikujiDataType) => {
    console.log('📥 loadData: データを更新します')
    data.value = normalizeData(newData)
    hasData.value = true
    dataErrorDetail.value = null
    console.log('✅ loadData: 完了')
  }
  // アプリ状態
  const appStatus = useAppStatus()

  // omiken
  const omikensActions = useOmikensActions()

  // botMessage
  const botMessageActions = useBotMessageActions()

  // 各種Service
  const services = createAppServices()

  return {
    data,
    hasData,
    dataErrorDetail,
    loadData,

    ...appStatus,
    ...omikensActions,
    ...botMessageActions,
    ...services,
  }
})
