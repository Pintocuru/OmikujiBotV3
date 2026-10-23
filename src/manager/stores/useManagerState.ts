// src/manager/stores/useManagerState.ts
import { ref, reactive } from 'vue'
import { FileItem, FileSortMode } from '@/manager/types'
import { isDev } from '@/types/env'

export function useManagerState() {
  // ファイル関連
  const saveFileName = ref('')
  const availableFiles = ref<FileItem[]>([])

  // 一覧の並び替え（デフォルトは名前順）
  const sortMode = ref<FileSortMode>('name')
  // 開いているフォルダ（デフォルト閉じ）
  const openFolders = ref<Set<string>>(new Set())

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
    sortMode,
    openFolders,
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
