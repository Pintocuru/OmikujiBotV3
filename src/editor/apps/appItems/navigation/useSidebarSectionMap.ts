// src/editor/apps/appItems/navigation/useSidebarSectionMap.ts
import { ComputedRef, computed } from 'vue'
import { storeToRefs } from 'pinia'
import { CategoryType } from '@/types/OmikujiData/'
import { SidebarSectionItem, categorySectionMap } from '@/editor/maps/category/CategorySectionMap'
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
    const dynamic = getUiEditorEntries()
      .filter(([kind]) => kinds.includes(kind))
      .map(([kind, item]): SidebarSectionItem => ({ section: kind, icon: item.icon }))

    return [{ section: 'commonStyle', icon: 'Palette' }, ...dynamic]
  })
}

/**
 * カテゴリのセクション項目を返す
 * ui は useUiSections() を使うこと
 */
export function getSidebarSections(category: Exclude<CategoryType, 'ui'>): SidebarSectionItem[] {
  return categorySectionMap[category] ?? []
}
