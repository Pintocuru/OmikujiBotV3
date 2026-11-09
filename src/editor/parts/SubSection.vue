<!-- src/editor/parts/SubSection.vue -->
<!-- SectionCard の中の副題つきブロック(SubSectionHeader + 中身)。sectionKey があるときは、SectionTabs で選択中のものだけ表示する -->
<template>
  <section v-show="isActive" :id="sectionKey ? `section-${sectionKey}` : undefined" class="space-y-2">
    <SubSectionHeader
      :icon="icon"
      :title="title"
      :title-key="titleKey"
      :description="description"
      :description-key="descriptionKey"
      :variant="variant"
    />
    <slot />
  </section>
</template>

<script setup lang="ts">
  import { toRef } from 'vue'
  import type { DaisyUIColorType } from '@/types/core'
  import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
  import SubSectionHeader from './SubSectionHeader.vue'
  import { useSectionActive } from './composables/useSectionActive'

  const props = defineProps<{
    icon: LucideIconName
    title?: string
    titleKey?: string
    description?: string
    descriptionKey?: string
    // SectionTabs のタブのキー。省略すると常に表示する
    sectionKey?: string
    // 見出しの下線の色(省略すると標準)
    variant?: DaisyUIColorType
  }>()

  const isActive = useSectionActive(toRef(props, 'sectionKey'))
</script>
