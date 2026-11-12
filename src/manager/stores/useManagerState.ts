// src/manager/stores/useManagerState.ts
import { ref, reactive } from 'vue'
import { FileItem, FileSortMode } from '@/manager/types'
import { isExpressMode } from '@/manager/services/baseApiClient'

export function useManagerState() {
  // ファイル関連
  const saveFileName = ref('')
  const availableFiles = ref<FileItem[]>([])

  // 一覧の並び替え
  const sortMode = ref<FileSortMode>('modified')
  // 開いているフォルダ
  const openFolders = ref<Set<string>>(new Set())
  // 検索文字列
  const searchQuery = ref('')

  /**
   * ローディング状態
   */
  const isSaving = ref(false) // 保存中
  const isLoading = ref(false) // 読込中
  const isLoadingFileList = ref(false) // リスト読込中

  // サーバー接続状態
  const isServerConnected = ref(false)

  // 個別ファイル削除状態
  const isDeletingFileMap = reactive(new Map<string, boolean>())

  return {
    saveFileName,
    availableFiles,
    sortMode,
    openFolders,
    searchQuery,
    isExpressMode,
    isSaving,
    isLoading,
    isLoadingFileList,
    isServerConnected,
    isDeletingFileMap,
  }
}
