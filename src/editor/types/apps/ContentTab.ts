// src/editor/types/apps/ContentTab.ts
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

/** ContentArea の上部に出すタブ1つ分。section は SectionCard の sectionKey と一致させる */
export type ContentTab = {
  section: string
  icon: LucideIconName
  /** タブに出す名前の i18n キー */
  labelKey: string
}

/** CategoryContentMap の sections の1行(label は section から決まるので持たない) */
export type ContentTabDef = Pick<ContentTab, 'section' | 'icon'>
