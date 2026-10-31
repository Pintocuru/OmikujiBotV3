// src/editor/types/apps/SidebarType.ts
import { CategoryType } from '@/types/OmikujiData'
import { BaseRecordType } from '@/types/core'

/**
 * サイドバー専用の型定義
 * カテゴリ名そのものは src/types/OmikujiData のものを使い、
 * ここでは「サイドバーでの見せ方」に必要な型だけを定義する
 */

/** jsonMerge の一覧の1行 */
export type SidebarStaticItem = {
  key: string
  label: string
}

/** ドラッグ可能なサブアイテム（Events / Assets） */
export type DraggableSubItem = {
  key: string
  label: string
  isEnabled?: boolean
  rawItem: BaseRecordType
}

/** ナビゲーションのグループ（サブラベル） */
type CategoryGroupId = 'events' | 'assets' | 'ui' | 'other'
export type CategoryGroup<K extends CategoryType = CategoryType> = { id: CategoryGroupId; keys: K[] }
