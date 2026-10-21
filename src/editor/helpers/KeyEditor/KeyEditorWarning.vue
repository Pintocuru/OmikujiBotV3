<!-- src/editor/helpers/KeyEditor/KeyEditorWarning.vue -->
<template>
  <div class="bg-secondary text-secondary-content p-4 rounded-lg flex items-start">
    <span class="text-2xl mr-3">⚠️</span>
    <span class="text-sm">
      <span class="font-bold">{{ $t('keyEditor.warning.base', { target: $t(`categories.${category}.label`) }) }}</span>
      <span class="block mt-2">{{ $t(`keyEditor.warning.notes.${category}`) }}</span>
    </span>
  </div>
</template>

<script setup lang="ts">
  import { AssetCategoryType } from '@/types/OmikujiData'

  defineProps<{ category: AssetCategoryType }>()
</script>
