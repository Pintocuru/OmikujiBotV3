// src/editor/parts/composables/useSectionTabs.ts
// IconRadioGroup をセクションタブとして使うための共通ロジック。
// ストアの activeSection(string | null)と IconRadioGroup の modelValue(K | '')の相互変換、
// activeSection がタブに無いときの先頭タブへのフォールバック、labelKey の i18n 変換を担う
import { computed, watch, type Ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNavigationStore } from '@/editor/stores/useNavigationStore'
import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
import type { ContentTab } from '@/editor/types/apps'

export const useSectionTabs = (tabs: Ref<readonly ContentTab[]>) => {
  // 選択中のタブ(SubSection / SectionCard の sectionKey と同じ値。TopPage などからも設定される)
  const { activeSection } = storeToRefs(useNavigationStore())

  // IconRadioGroup の modelValue は K | ''(未選択)なので、ストアの string | null と相互変換する
  const selectedSection = computed<string | ''>({
    get: () => activeSection.value ?? '',
    set: (value) => {
      activeSection.value = value === '' ? null : value
    },
  })

  const tabSections = computed(() => tabs.value.map((tab) => tab.section))

  const tabIcons = computed(
    () => Object.fromEntries(tabs.value.map((tab) => [tab.section, tab.icon])) as Record<string, LucideIconName>
  )

  // labelKey が <base>.label 形式のため、IconRadioGroup の i18nBase(<base>.label / <base>.description)に合わせて .label を外す
  const i18nBaseOf = (key: string): string =>
    tabs.value.find((tab) => tab.section === key)?.labelKey.replace(/\.label$/, '') ?? key

  // activeSection がタブに無いとき(カテゴリ切り替え直後など)は、先頭のタブに揃える
  watch(
    [tabs, activeSection],
    () => {
      if (tabs.value.length === 0) return
      if (tabs.value.some((tab) => tab.section === activeSection.value)) return
      activeSection.value = tabs.value[0].section
    },
    { immediate: true }
  )

  return { selectedSection, tabSections, tabIcons, i18nBaseOf }
}
