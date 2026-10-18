// src/editor/apps/navigation/composables/useSidebarSectionMap.ts
import { ComputedRef, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { DataCategoryType, UiKind } from '@/types/OmikujiData/'
import { SidebarObjectCategory, SidebarSectionItem } from '@/editor/types/apps'
import { appInfoSections, categorySectionMap } from '@/editor/maps/category/CategorySectionMap'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { uiLayoutMap } from '@/maps/OmikujiData'
import { getUiEditorEntries } from '@/editor/ui/uiEditorRegistry'

/**
 * ui カテゴリのセクション項目を返す
 * 共通設定（commonStyle）＋ 選択中レイアウトが使う UI のうち、main.ts で登録済みのもの
 */
export function useUiSections(): ComputedRef<SidebarSectionItem[]> {
  const { data } = storeToRefs(useOmikujiStore())

  return computed<SidebarSectionItem[]>(() => {
    const kinds = uiLayoutMap[data.value.ui.layout].kinds
    const dynamic = Object.entries(getUiEditorEntries())
      .filter(([kind]) => kinds.includes(kind as UiKind))
      .map(([kind, item]): SidebarSectionItem => ({
        section: kind as UiKind,
        icon: item.icon,
      }))

    return [{ section: 'commonStyle', icon: 'Palette' }, ...dynamic]
  })
}

/**
 * Events / Assets のセクション項目を返す
 */
export function getSidebarSections(category: DataCategoryType): SidebarSectionItem[] {
  return categorySectionMap[category]
}

/**
 * ui / appInfo のセクション項目を返す（常に ComputedRef）
 */
export function useObjectSections() {
  const uiSections = useUiSections()
  const appInfo = computed(() => appInfoSections)

  return (category: SidebarObjectCategory): ComputedRef<SidebarSectionItem[]> =>
    category === 'ui' ? uiSections : appInfo
}
