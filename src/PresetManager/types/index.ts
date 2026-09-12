// src/PresetManager/types/index.ts
import { Ref } from 'vue'

/**
 * DevConfigsState ステータス
 */
export interface DevConfigStateType {
  // ファイル関連
  saveFileName: Ref<string>
  availableFiles: Ref<FileItem[]>

  // ローディング状態
  isExpressMode: Ref<boolean>
  isSaving: Ref<boolean>
  isLoading: Ref<boolean>
  isDeleting: Ref<boolean>
  isLoadingFileList: Ref<boolean>
  isExecutingConfirm: Ref<boolean>

  // 接続状態
  isServerConnected: Ref<boolean>

  // 個別のファイル削除状態を管理
  isDeletingFileMap: Map<string, boolean>
}

/**
 * jsonファイル
 */
export interface FileItem {
  name: string // "category/file.json" （APIからの値）
  displayName: string // "file.json" （表示用）
  folder: string | null // "category" or null
  modified: string
}
