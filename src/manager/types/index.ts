// src/manager/types/index.ts
import { Ref } from 'vue'

/**
 * DevConfigsState ステータス
 */
export interface DataManagerType {
  // ファイル関連
  saveFileName: Ref<string>
  availableFiles: Ref<FileItem[]>

  // 一覧の並び替え・フォルダ開閉
  sortMode: Ref<FileSortMode>
  openFolders: Ref<Set<string>>

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

/**
 * ファイル一覧の並び替え
 * name: 名前（A→Z）/ modified: 更新日時（新しい順）/ history: 履歴（新しい順・フォルダ区分なし）
 */
export type FileSortMode = 'name' | 'modified' | 'history'

/**
 * 一覧の表示ブロック（ルート直下ファイルの塊 or フォルダ）
 */
export type FileBlock =
  | { type: 'files'; key: string; files: FileItem[] }
  | { type: 'folder'; key: string; folder: string; files: FileItem[] }
