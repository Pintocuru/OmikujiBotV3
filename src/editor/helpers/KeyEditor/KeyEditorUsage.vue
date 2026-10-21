<!-- src/editor/helpers/KeyEditor/KeyEditorUsage.vue -->
<template>
  <div class="bg-primary text-primary-content p-4 rounded-lg text-sm">
    <p class="font-bold">📊 {{ $t('keyEditor.usage.title') }}</p>
    <ul v-if="rows.length > 0" class="list-disc list-inside mt-2 space-y-1">
      <li v-for="row in rows" :key="row.category">
        {{ $t(`keyEditor.usage.events.${row.category}`) }}:
        <span class="font-bold">{{ $t('keyEditor.usage.count', { count: row.count }) }}</span>
      </li>
    </ul>
    <p v-else class="mt-2">{{ $t('keyEditor.usage.unused') }}</p>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { eventCategory, EventCategoryType } from '@/types/OmikujiData'

  const props = defineProps<{
    usage: Readonly<Record<EventCategoryType, readonly string[]>>
  }>()

  // 使われているカテゴリだけを、定義順に表示
  const rows = computed(() =>
    eventCategory.map((category) => ({ category, count: props.usage[category].length })).filter((row) => row.count > 0)
  )
</script>
