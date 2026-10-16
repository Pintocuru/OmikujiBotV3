// src/editor/types/apps/SidebarType.ts
import { Ref } from 'vue'
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
import { CategoryType, DataCategoryType, SettingsCategoryType } from '@/types/OmikujiData'
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

/**
 * カテゴリごとのサブ項目の表示バリアント
 * - record: Events / Assets（新規作成 + ドラッグ可能なリスト）
 * - array : jsonMerge（静的リスト）
 * - object: ui / appInfo（セクションリスト）
 */
export type SidebarVariant = 'record' | 'array' | 'object'

export type SidebarRecordCategory = DataCategoryType
export type SidebarArrayCategory = Extract<SettingsCategoryType, 'jsonMerge'>
export type SidebarObjectCategory = Exclude<SettingsCategoryType, SidebarArrayCategory> // 'ui' | 'appInfo'

/**
 * バリアントとカテゴリの組。variant で category が絞り込める
 * （SidebarRecordItems には DataCategoryType、SidebarObjectItems には 'ui' | 'appInfo' だけが渡る）
 */
export type SidebarCategoryEntry =
  | { variant: 'record'; category: SidebarRecordCategory }
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
export type CategoryGroup = { id: CategoryGroupId; keys: CategoryType[] }

/** provide / inject で子孫に渡す状態 */
export type SidebarContext = {
  selectedItemKey: Ref<string | null>
  activeSection: Ref<string | null>
}
