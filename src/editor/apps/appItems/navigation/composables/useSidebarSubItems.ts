// src/editor/apps/appItems/navigation/composables/useSidebarSubItems.ts
import { storeToRefs } from 'pinia'
import { CategoryType } from '@/types/OmikujiData/'
import { SidebarCategoryEntry, SidebarStaticItem } from '@/editor/types/apps'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useGetEventData } from '@/editor/stores/useGetEventData'
import { useGetAssetData } from '@/editor/stores/useGetAssetData'
import { useObjectSections } from './useSidebarSectionMap'
import i18n from '@/editor/i18n'

export const useSidebarSubItems = () => {
  const { data } = storeToRefs(useOmikujiStore())
  const { isEventCategory } = useGetEventData()
  const { isAssetCategory } = useGetAssetData()
  const getObjectSections = useObjectSections()

  /**
   * カテゴリを「表示バリアント + 絞り込み済みカテゴリ」に変換する
   * 分岐は OmikujiData の型ガードだけで完結し、最後の else は 'ui' | 'appInfo' に絞り込まれる
   */
  const resolveEntry = (category: CategoryType): SidebarCategoryEntry => {
    if (isEventCategory(category) || isAssetCategory(category)) return { variant: 'record', category }
    if (category === 'jsonMerge') return { variant: 'array', category }
    return { variant: 'object', category }
  }

  /** jsonMerge の静的アイテムリスト */
  const getJsonMergeItems = (): SidebarStaticItem[] =>
    data.value.jsonMerge.map((item) => ({
      key: item.key,
      label: item.name || i18n.global.t('navigation.unnamed'),
    }))

  return { resolveEntry, getJsonMergeItems, getObjectSections }
}
