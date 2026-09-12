// src/PresetManager/stores/useDevConfigState.ts
import { ref, reactive } from 'vue'
import { FileItem } from '@/PresetManager/types'
import { isDev } from '@/types'

export function useDevConfigState() {
  // ファイル関連
  const saveFileName = ref('')
  const availableFiles = ref<FileItem[]>([])

  // APIモード（開発環境ではExpressモードがデフォルト、本番環境ではわんコメPluginのみ）
  const isExpressMode = ref(isDev)

  /**
   * ローディング状態
   */
  const isSaving = ref(false) // 保存中
  const isLoading = ref(false) // 読込中
  const isDeleting = ref(false) // 削除中
  const isLoadingFileList = ref(false) // リスト読込中
  const isExecutingConfirm = ref(false) // ??

  // サーバー接続状態
  const isServerConnected = ref(false)

  // 個別ファイル削除状態
  const isDeletingFileMap = reactive(new Map<string, boolean>())

  return {
    saveFileName,
    availableFiles,
    isExpressMode,
    isSaving,
    isLoading,
    isDeleting,
    isLoadingFileList,
    isExecutingConfirm,
    isServerConnected,
    isDeletingFileMap,
  }
}
