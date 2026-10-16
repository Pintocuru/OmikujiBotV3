// src/editor/stores/composables/useDataIO.ts
import { Ref } from 'vue'
import { OmikujiDataType } from '@/types/OmikujiData'
import { DataSource } from '@/editor/types'
import { normalizeData } from '@/common/migrations'
import { swalModal } from '@/common/SweetAlert2/SweetAlert2Toast'

/**
 * データの入出力（読み込み・保存・エクスポート）を提供
 */
export function useDataIO(data: Ref<OmikujiDataType>, dataSource: Ref<DataSource>) {
  // データを読み込み、マイグレーションとバリデーションを行う
  const loadData = (loadData: unknown): boolean => {
    try {
      data.value = normalizeData(loadData)
      dataSource.value = 'api'
      return true
    } catch (error) {
      swalModal.error({ title: 'データの読み込み中にエラーが発生しました', text: error })
      console.error('Load data error:', error)
      return false
    }
  }

  // グローバルの omikujiData.js を開く
  const openLocalOmikujiData = () => {
    const result = loadData(window.omikujiData)
    if (result) dataSource.value = 'local'
  }

  return {
    loadData,
    openLocalOmikujiData,
  }
}
