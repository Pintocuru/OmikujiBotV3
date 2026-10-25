// src/editor/types/apps/SidebarType.ts
import { Ref } from 'vue'
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
import { CategoryType, SettingsCategoryType } from '@/types/OmikujiData'
import { BaseRecordType } from '@/types/core'

/**
 * サイドバー専用の型定義
 * カテゴリ名そのものは src/types/OmikujiData のものを使い、
 * ここでは「サイドバーでの見せ方」に必要な型だけを定義する
 */

/** サブアイテムの下に表示するセクション項目 */
export type SidebarSectionItem = {
  section: string
  icon: LucideIconName
  component?: string
}

export type SidebarArrayCategory = Extract<SettingsCategoryType, 'jsonMerge'>
export type SidebarObjectCategory = Exclude<SettingsCategoryType, SidebarArrayCategory> // 'ui' | 'appInfo'

/**
 * 設定系のバリアントとカテゴリの組。variant で category が絞り込める
 * （SidebarArrayItems には 'jsonMerge'、SidebarObjectItems には 'ui' | 'appInfo' だけが渡る）
 */
export type SidebarSettingsEntry =
  | { variant: 'array'; category: SidebarArrayCategory }
  | { variant: 'object'; category: SidebarObjectCategory }

/** 静的リスト（jsonMerge）の1行 */
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
export type CategoryGroupId = 'events' | 'assets' | 'ui' | 'other'
export type CategoryGroup<K extends CategoryType = CategoryType> = { id: CategoryGroupId; keys: K[] }

/** provide / inject で子孫に渡す状態 */
export type SidebarContext = {
  selectedItemKey: Ref<string | null>
  activeSection: Ref<string | null>
}
