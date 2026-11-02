<!-- src/editor/content/top/TopCategoryHeader.vue -->
<!-- TOPページ各セクションの見出し(アイコン + タイトル + 件数) -->
<template>
  <div class="rounded-lg -mx-1 px-1">
    <SubSectionHeader :icon="icon" :title="title">
      <span class="text-sm font-normal text-base-content/60">
        {{ t(count === 1 ? 'topPage.countOne' : 'topPage.count', { count }) }}
      </span>
    </SubSectionHeader>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import type { LucideIconName } from '@/common/LucideIcon/useLucideIcon'
  import SubSectionHeader from '@/editor/parts/SubSectionHeader.vue'

  defineProps<{
    icon: LucideIconName
    title: string
    count: number
  }>()

  const { t } = useI18n()
</script>
