// src/editor/content/composables/useContentTabs.ts
import { computed, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { isDev } from '@/types/env'
import type { ContentTab } from '@/editor/types/apps'
import { categoryContentMap } from '@/editor/maps/category/CategoryContentMap'
import { useVisibleUiKinds } from '@/editor/ui/useVisibleUiKinds'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'

/**
 * 選択中カテゴリの、ContentArea に出すタブを返す。
 * タブを持つのは複数セクションのカテゴリ(ui / appInfo)だけで、それ以外は空配列になる。
 * activeSection がタブに無いとき(カテゴリ切り替え直後など)は、先頭のタブに揃える。
 */
export const useContentTabs = () => {
  const navigationStore = useNavigationStore()
  const { selectedCategory, selectedItemKey, activeSection } = storeToRefs(navigationStore)
  const visibleUiKinds = useVisibleUiKinds()

  // ui のタブは登録済みの UI から作る(appInfo など他のカテゴリは、下の静的な対応表から作る)
  const uiTabs = computed<ContentTab[]>(() => {
    const kindTabs = visibleUiKinds.value.map(
      ({ kind, entry }): ContentTab => ({
        section: kind,
        icon: entry.icon,
        labelKey: `mapText.uiKind.${kind}.label`,
      })
    )

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
