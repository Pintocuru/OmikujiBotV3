import { LucideIconName } from '@/common/LucideIcon/useLucideIcon'

/** エディター(UiEditor / AppInfoEditor)が IconRadioGroup に出すタブ1つ分。section は SubSection / SectionCard の sectionKey と一致させる */
export type ContentTab = {
  section: string
  icon: LucideIconName
  /** タブに出す名前の i18n キー(<base>.label 形式。useSectionTabs の i18nBaseOf で <base> に変換される) */
  labelKey: string
}
