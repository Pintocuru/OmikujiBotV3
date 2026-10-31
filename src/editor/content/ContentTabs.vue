<!-- src/editor/content/ContentTabs.vue -->
<!-- ContentArea の上部に出すタブ。スクロールしても隠れないよう上に貼り付ける -->
<template>
  <div role="tablist" class="tabs tabs-border tabs-lg flex-wrap sticky top-0 z-10 bg-base-100">
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
  import { useI18n } from 'vue-i18n'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'
  import { ContentTab } from '@/editor/types/apps'

  defineProps<{ tabs: ContentTab[] }>()

  // 選択中のタブ(SectionCard の sectionKey と同じ値)
  const activeSection = defineModel<string | null>('activeSection', { required: true })

  const { t } = useI18n()
</script>
