<!-- components/EvaluationTable.vue -->
<template>
  <div class="max-h-64 overflow-y-auto rounded border border-base-300">
    <table class="table table-xs table-zebra table-pin-rows">
      <thead>
        <tr>
          <th>{{ t('editorPreview.evaluationBlock.variables') }}</th>
          <th class="text-right">{{ t('editorPreview.evaluationBlock.value') }}</th>
          <th class="w-12"></th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="[key, value] in rows"
          :key="key"
          class="transition-colors duration-500"
          :class="flashKeys.has(key) ? 'bg-warning/40' : ''"
        >
          <td class="font-mono text-primary break-all">{{ key }}</td>
          <td class="text-right">
            <span class="font-mono tabular-nums break-all">{{ value }}</span>
            <span class="badge badge-xs badge-ghost ml-1">
              {{
                typeof value === 'number'
                  ? t('editorPreview.evaluationBlock.numberType')
                  : t('editorPreview.evaluationBlock.stringType')
              }}
            </span>
          </td>
          <td class="whitespace-nowrap">
            <div class="tooltip tooltip-left" :data-tip="t('editorPreview.evaluationBlock.edit')">
              <button
                class="btn btn-xs btn-ghost btn-square opacity-60"
                :aria-label="t('editorPreview.evaluationBlock.edit')"
                @click="emit('edit', key, value)"
              >
                <Pencil class="w-4 h-4" />
              </button>
            </div>
            <div class="tooltip tooltip-left" :data-tip="t('editorPreview.evaluationBlock.delete')">
              <button
                class="btn btn-xs btn-error btn-square opacity-60"
                :aria-label="t('editorPreview.evaluationBlock.delete')"
                @click="emit('remove', key)"
              >
                <Trash2 class="w-4 h-4" />
              </button>
            </div>
          </td>
        </tr>
        <tr v-if="rows.length === 0">
          <td colspan="3" class="text-center opacity-60 py-3">
            {{
              total === 0
                ? t('editorPreview.evaluationBlock.noVariables')
                : t('editorPreview.evaluationBlock.noMatches')
            }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { Pencil, Trash2 } from '@lucide/vue'
  import type { VarEntry, VarValue } from '../evaluationStats'

  defineProps<{ rows: VarEntry[]; total: number; flashKeys: Set<string> }>()
  const emit = defineEmits<{
    edit: [key: string, value: VarValue]
    remove: [key: string]
  }>()
  const { t } = useI18n()
</script>
