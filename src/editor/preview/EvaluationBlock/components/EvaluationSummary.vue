<!-- components/EvaluationSummary.vue -->
<template>
  <div class="rounded border border-base-300 p-2 space-y-1 text-xs">
    <div class="font-semibold">
      {{ query.trim() }} :
      {{
        t(
          summary.matched === 1
            ? 'editorPreview.evaluationBlock.matchedCountOne'
            : 'editorPreview.evaluationBlock.matchedCountOther',
          { count: summary.matched }
        )
      }}
    </div>

    <template v-if="summary.numbers">
      <div class="flex flex-wrap gap-1">
        <span class="badge badge-sm badge-primary">
          {{ t('editorPreview.evaluationBlock.average', { value: summary.numbers.avg }) }}
        </span>
        <span class="badge badge-sm badge-ghost">
          {{ t('editorPreview.evaluationBlock.sum', { value: summary.numbers.sum }) }}
        </span>
        <span class="badge badge-sm badge-ghost">
          {{ t('editorPreview.evaluationBlock.max', { value: summary.numbers.max }) }}
        </span>
        <span class="badge badge-sm badge-ghost">
          {{ t('editorPreview.evaluationBlock.min', { value: summary.numbers.min }) }}
        </span>
      </div>
      <ol class="max-h-28 overflow-y-auto space-y-0.5">
        <li v-for="(row, i) in summary.numbers.ranking" :key="row.key" class="flex gap-2">
          <span class="w-5 text-right opacity-60">{{ i + 1 }}</span>
          <span class="font-mono flex-1 truncate" :title="row.key">{{ row.label }}</span>
          <span class="font-mono tabular-nums">{{ row.value }}</span>
        </li>
      </ol>
    </template>

    <template v-if="summary.strings">
      <div class="opacity-60">{{ t('editorPreview.evaluationBlock.stringOccurrences') }}</div>
      <ol class="max-h-28 overflow-y-auto space-y-0.5">
        <li v-for="(row, i) in summary.strings.ranking" :key="row.value" class="flex gap-2">
          <span class="w-5 text-right opacity-60">{{ i + 1 }}</span>
          <span class="flex-1 truncate">{{ row.value }}</span>
          <span class="font-mono tabular-nums">×{{ row.count }}</span>
        </li>
      </ol>
    </template>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import type { WildcardSummary } from '../evaluationStats'

  defineProps<{ query: string; summary: WildcardSummary }>()
  const { t } = useI18n()
</script>
