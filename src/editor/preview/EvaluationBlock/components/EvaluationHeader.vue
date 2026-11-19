<!-- src/editor/preview/EvaluationBlock/components/EvaluationHeader.vue -->
<template>
  <div
    class="flex items-center justify-between border-b border-base-300 cursor-pointer"
    @click="collapsed = !collapsed"
  >
    <h1 class="text-sm flex items-center gap-2">
      {{ t('editorPreview.evaluationBlock.title') }}
      <span class="badge badge-xs badge-neutral">{{ count }}</span>
      <span v-if="paused" class="badge badge-xs badge-warning">{{ t('editorPreview.evaluationBlock.paused') }}</span>
    </h1>
    <span class="text-xs opacity-60">{{ collapsed ? '▶' : '▼' }}</span>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'

  defineProps<{ count: number; paused: boolean }>()
  const collapsed = defineModel<boolean>('collapsed', { required: true })
  const { t } = useI18n()
</script>
