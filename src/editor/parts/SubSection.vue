<!-- src/editor/parts/SubSection.vue -->
<!-- SectionCard の中の副題つきブロック(SubSectionHeader + 中身)。sectionKey があるときは、SectionTabs で選択中のものだけ表示する -->
<template>
  <section v-show="isActive" :id="sectionKey ? `section-${sectionKey}` : undefined" class="space-y-2">
    <SubSectionHeader :icon="icon" :title-key="titleKey" :description-key="descriptionKey" />
    <slot />
  </section>
</template>

<script setup lang="ts">
  import { toRef } from 'vue'
  import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
  import SubSectionHeader from './SubSectionHeader.vue'
  import { useSectionActive } from './composables/useSectionActive'

  const props = defineProps<{
    icon: LucideIconName
    titleKey?: string
    descriptionKey?: string
    sectionKey?: string
  }>()

  const isActive = useSectionActive(toRef(props, 'sectionKey'))
</script>
