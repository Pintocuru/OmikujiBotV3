<!-- src/editor/content/top/TopEventOrderHelp.vue -->
<!-- TOPページ: events の「判定の順番」の説明(はてなボタン) -->
<template>
  <HelpButton :title="t('topPage.orderHelp.title')">
    <p>{{ t('topPage.orderHelp.summary') }}</p>
    <p v-if="category === 'comments'">{{ t('topPage.orderHelp.comments') }}</p>
  </HelpButton>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import type { EventCategoryType } from '@/types/OmikujiData'
  import HelpButton from '@/editor/parts/HelpButton.vue'

  defineProps<{
    category: EventCategoryType
  }>()

  const { t } = useI18n()
</script>
