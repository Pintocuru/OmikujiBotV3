// src/editor/content/composables/useContentTabs.ts
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { UiKind } from '@/types/OmikujiData/'
import { isDev } from '@/types/env'
import { uiLayoutMap } from '@/maps/OmikujiData'
import { ContentTab } from '@/editor/types/apps'
import { categoryContentMap } from '@/editor/maps/category/CategoryContentMap'
import { getUiEditorEntries } from '@/editor/ui/uiEditorRegistry'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'

/**
 * 選択中カテゴリの、ContentArea に出すタブを返す。
 * タブを持つのは複数セクションのカテゴリ(ui / appInfo)だけで、それ以外は空配列になる。
 * activeSection がタブに無いとき(カテゴリ切り替え直後など)は、先頭のタブに揃える。
 */
export const useContentTabs = () => {
  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey, activeSection } = storeToRefs(navigationStore)
  const { data } = storeToRefs(useOmikujiStore())

  // appInfo は静的な対応表から、ui は登録済みの UI から作る
  const uiTabs = computed<ContentTab[]>(() => {
    // 選択中レイアウトが使う UI のうち、main.ts で登録済みのものだけ
    const kinds = uiLayoutMap[data.value.ui.layout].kinds
    const kindTabs = Object.entries(getUiEditorEntries())
      .filter(([kind]) => kinds.includes(kind as UiKind))
      .map(([kind, entry]): ContentTab => ({
        section: kind,
        icon: entry.icon,
        labelKey: `mapText.uiKind.${kind}.label`,
      }))

    const devTab: ContentTab[] = isDev
      ? [{ section: 'dev', icon: 'LayoutGrid', labelKey: 'shell.contentTabs.dev' }]
      : []
    const commonTab: ContentTab = {
      section: 'commonStyle',
      icon: 'Palette',
      labelKey: 'categorySections.commonStyle.label',
    }
    return [...devTab, ...kindTabs, commonTab]
  })

  const toTabs = (defs: { section: string; icon: ContentTab['icon'] }[]): ContentTab[] =>
    defs.map((def) => ({ ...def, labelKey: `categorySections.${def.section}.label` }))

  const tabs = computed<ContentTab[]>(() => {
    const category = selectedCategory.value
    if (category === 'ui') return uiTabs.value
    const sections = categoryContentMap[category].sections
    return sections ? toTabs(sections) : []
  })

  watch(
    [tabs, selectedCategory, selectedItemKey],
    () => {
      if (tabs.value.length === 0) return
      if (tabs.value.some((tab) => tab.section === activeSection.value)) return
      activeSection.value = tabs.value[0].section
    },
    { immediate: true }
  )

  return { tabs, activeSection }
}
