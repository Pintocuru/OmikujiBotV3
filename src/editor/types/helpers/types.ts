// src/editor/types/helpers/types.ts
import { DataCategoryType, UiKind } from '@/types/OmikujiData/'

export type ImportMode = 'full-replace' | 'partial-replace' | 'partial-merge'

export interface ConflictInfo {
  key: string
  name: string
}

export interface CategoryImportConfig {
  enabled: boolean
  mode: ImportMode
  count: number
  conflicts: ConflictInfo[]
}

export interface ComponentImportConfig {
  enabled: boolean
  useImported: boolean // true: 読み込み側を使用, false: 既存を使用
}

export interface ImportPreview {
  recordCategories: Record<DataCategoryType, CategoryImportConfig>
  componentConfigs: Record<UiKind, ComponentImportConfig>
  /** 読み込み側にのみ存在する UI 設定のキー(componentConfigs には enabled / useImported=true で登録済み) */
  importOnlyComponents: UiKind[]
  totalItems: number
}
