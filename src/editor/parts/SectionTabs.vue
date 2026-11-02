<!-- src/editor/parts/SectionTabs.vue -->
<!-- SectionCard の sectionKey を切り替えるタブ。スクロールしても隠れないよう上に貼り付ける(左右はスクロール領域の p-4 の分だけ広げる) -->
<!-- どのタブを出すかは、使う側のエディター(UiEditor / AppInfoEditor)が自分で決めて tabs に渡す -->
<template>
  <div role="tablist" class="tabs tabs-border tabs-lg flex-wrap sticky top-0 z-10 -mx-4 bg-base-100 px-4">
    <button
      v-for="tab in tabs"
      :key="tab.section"
      role="tab"
      class="tab gap-2"
      :class="{ 'tab-active font-bold': tab.section === activeSection }"
      @click="activeSection = tab.section"
    >
      <component :is="resolveLucideIcon(tab.icon)" class="w-5 h-5 shrink-0" />
      {{ t(tab.labelKey) }}
    </button>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useI18n } from 'vue-i18n'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { useNavigationStore } from '@/editor/stores/useNavigationStore'
  import type { ContentTab } from '@/editor/types/apps'

  const props = defineProps<{ tabs: ContentTab[] }>()

  const { t } = useI18n()

  // 選択中のタブ(SectionCard の sectionKey と同じ値。TopPage などからも設定される)
  const { activeSection } = storeToRefs(useNavigationStore())

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
