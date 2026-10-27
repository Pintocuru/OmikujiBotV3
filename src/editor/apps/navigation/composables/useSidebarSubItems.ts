// src/editor/apps/navigation/composables/useSidebarSubItems.ts
import { storeToRefs } from 'pinia'
import { SettingsCategoryType } from '@/types/OmikujiData/'
import { SidebarSettingsEntry, SidebarStaticItem } from '@/editor/types/apps'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useObjectSections } from './useSidebarSectionMap'
import i18n from '@/editor/i18n'

export const useSidebarSubItems = () => {
  const { data } = storeToRefs(useOmikujiStore())
  const getObjectSections = useObjectSections()

  /**
   * 設定系カテゴリを「表示バリアント + 絞り込み済みカテゴリ」に変換する
   */
  const resolveSettingsEntry = (category: SettingsCategoryType): SidebarSettingsEntry =>
    category === 'jsonMerge' ? { variant: 'array', category } : { variant: 'object', category }

  /** jsonMerge の静的アイテムリスト */
  const getJsonMergeItems = (): SidebarStaticItem[] =>
    data.value.jsonMerge.map((item) => ({
      key: item.id, // JsonMergeEditor の選択キー(id)と揃える
      label: item.name || i18n.global.t('navigation.unnamed'),
    }))

  return { resolveSettingsEntry, getJsonMergeItems, getObjectSections }
}
