<!-- src/editor/parts/SectionTabs.vue -->
<!-- SubSection / SectionCard の sectionKey を切り替えるタブ -->
<template>
  <div class="flex-wrap sticky top-0 z-10 -mx-4 bg-base-200 px-4 py-2">
    <IconRadioGroup
      v-model="selectedSection"
      i18n-prefix="sectionTabs"
      :icons="tabIcons"
      :keys="tabSections"
      :i18n-base-of="i18nBaseOf"
      :compactThreshold="15"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import IconRadioGroup from '@/editor/parts/IconRadioGroup.vue'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
  import type { ContentTab } from '@/editor/types/apps'

  const props = defineProps<{ tabs: ContentTab[] }>()

  // 選択中のタブ(SubSection / SectionCard の sectionKey と同じ値。TopPage などからも設定される)
  const { activeSection } = storeToRefs(useNavigationStore())

  // IconRadioGroup の modelValue は K | ''(未選択)なので、ストアの string | null と相互変換する
  const selectedSection = computed<string | ''>({
    get: () => activeSection.value ?? '',
    set: (value) => {
      activeSection.value = value === '' ? null : value
    },
  })

  const tabSections = computed(() => props.tabs.map((tab) => tab.section))

  const tabIcons = computed(
    () => Object.fromEntries(props.tabs.map((tab) => [tab.section, tab.icon])) as Record<string, LucideIconName>
  )

  // labelKey が <base>.label 形式のため、IconRadioGroup の i18nBase(<base>.label / <base>.description)に合わせて .label を外す
  const i18nBaseOf = (key: string): string =>
    props.tabs.find((tab) => tab.section === key)?.labelKey.replace(/\.label$/, '') ?? key

  // activeSection がタブに無いとき(カテゴリ切り替え直後など)は、先頭のタブに揃える
  watch(
    [() => props.tabs, activeSection],
    () => {
      if (props.tabs.length === 0) return
      if (props.tabs.some((tab) => tab.section === activeSection.value)) return
      activeSection.value = props.tabs[0].section
    },
    { immediate: true }
  )
</script>
