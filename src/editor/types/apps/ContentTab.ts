// src/editor/types/apps/ContentTab.ts
import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

/** SectionTabs に出すタブ1つ分。section は SubSection / SectionCard の sectionKey と一致させる */
export type ContentTab = {
  section: string
  icon: LucideIconName
  /** タブに出す名前の i18n キー */
  labelKey: string
}
