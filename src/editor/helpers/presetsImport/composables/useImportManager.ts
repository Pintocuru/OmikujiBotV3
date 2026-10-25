// src/editor/helpers/presetsImport/composables/useImportManager.ts
import { ref, computed } from 'vue'
import { DataCategoryType, OmikujiDataType, UiKind } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { normalizeData } from '@/common/migrations/index'
import { generateCategoryPreview, generateComponentPreview } from './importHelpers'
import { CategoryImportConfig, ComponentImportConfig, ImportPreview } from '@/editor/types'

/**
 * インポート処理を管理するComposable
 */
export const useImportManager = () => {
  // State
  const importedData = ref<OmikujiDataType | null>(null)
  const previewData = ref<ImportPreview | null>(null)
  const isLoading = ref(false)
  const loadError = ref('')
  const showPreviewModal = ref(false)

  // Computed
  const hasImportedData = computed(() => !!importedData.value)
  const hasPreviewData = computed(() => !!previewData.value)
  const enabledCategories = computed(() => {
    if (!previewData.value) return []
    return Object.entries(previewData.value.recordCategories)
      .filter(([, config]) => config.enabled)
      .map(([category]) => category as DataCategoryType)
  })

  /**
   * JSONデータから直接読み込む
   */
  const loadFromJsonData = async (jsonData: any): Promise<{ success: boolean; data?: any; error?: string }> => {
    isLoading.value = true
    loadError.value = ''

    try {
      const generatorName = jsonData.meta?.generatorName
      if (!generatorName || generatorName !== 'omikuji-bot') {
        return {
          success: false,
          error: 'invalid-metadata',
          data: jsonData,
        }
      }

      const validatedData = normalizeData(jsonData)
      importedData.value = validatedData

      return { success: true, data: validatedData }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'データ読み込みエラー'
      loadError.value = message
      return { success: false, error: message }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * プレビューデータを生成
   */
  const generatePreview = () => {
    if (!importedData.value) return null

    const omikujiStore = useOmikujiStore()
    const currentData = omikujiStore.data
    const validatedImportData = importedData.value

    const { recordCategories, totalItems } = generateCategoryPreview(currentData, validatedImportData)

    const componentConfigs = generateComponentPreview(currentData, validatedImportData)

    const preview: ImportPreview = {
      recordCategories,
      componentConfigs,
      totalItems,
    }

    previewData.value = preview
    return preview
  }

  /**
   * カテゴリ設定を更新
   */
  const updateCategoryConfig = (category: DataCategoryType, config: Partial<CategoryImportConfig>) => {
    if (!previewData.value?.recordCategories[category]) return

    previewData.value.recordCategories[category] = {
      ...previewData.value.recordCategories[category],
      ...config,
    }
  }

  /**
   * コンポーネント設定を更新
   * キーが存在しない場合は新規作成（読み込み側のみのキー対応）
   */
  const updateComponentConfig = (component: UiKind, config: Partial<ComponentImportConfig>) => {
    if (!previewData.value) return

    const current = previewData.value.componentConfigs[component]
    previewData.value.componentConfigs[component] = {
      ...(current ?? { enabled: true, useImported: true }),
      ...config,
    }
  }

  /**
   * インポートを実行
   */
  const executeImport = (): boolean => {
    if (!importedData.value || !previewData.value) return false

    const omikujiStore = useOmikujiStore()
    const result = omikujiStore.mergeDataSets(importedData.value, previewData.value)

    if (result) resetImportProcess()

    return result
  }

  /**
   * プレビューモーダルを開く
   */
  const openPreviewModal = () => {
    showPreviewModal.value = true
  }

  /**
   * プレビューモーダルを閉じる
   */
  const closePreviewModal = () => {
    showPreviewModal.value = false
  }

  /**
   * インポートプロセスをリセット
   */
  const resetImportProcess = () => {
    importedData.value = null
    previewData.value = null
    loadError.value = ''
    showPreviewModal.value = false
  }

  return {
    // State
    importedData,
    previewData,
    isLoading,
    loadError,
    showPreviewModal,

    // Computed
    hasImportedData,
    hasPreviewData,
    enabledCategories,

    // Actions
    loadFromJsonData,
    generatePreview,
    updateCategoryConfig,
    updateComponentConfig,
    executeImport,
    openPreviewModal,
    closePreviewModal,
    resetImportProcess,
  }
}
