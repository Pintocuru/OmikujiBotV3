// src/editor/types/apps/ItemContentDef.ts
import type { Component } from 'vue'
import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

/**
 * Events / Assets の 1 画面 1 セクションの内容。ItemEditor が、これをもとに SectionCard で包んで表示する
 * (選択中アイテムの取得・更新、無効イベントの通知は ItemEditor がまとめて担当する)
 */
export type ItemContentDef = {
  /** セクションの中身(子エディター) */
  component: Component
  /** SectionCard の見出し。ラベルと説明は i18n キー */
  section: { icon: LucideIconName; labelKey: string; descriptionKey: string }
  /**
   * 子エディターの v-model に渡すアイテムのプロパティ名。
   * 省略するとアイテム全体を渡し、null なら v-model を渡さない(子がキーから自分で読む場合)
   */
  modelField?: string | null
  /** アイテムのキー(events は id)を受け取る子エディターの props 名。受け取らないなら省略 */
  keyProp?: string
  /** セクションの上に出す補足(InformationCard)。アイテムが無効でも出す。値は i18n キー */
  noticeKey?: string
}
