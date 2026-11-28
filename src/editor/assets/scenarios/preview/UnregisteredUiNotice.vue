<!-- src/editor/assets/scenarios/preview/UnregisteredUiNotice.vue -->
<template>
  <div class="card bg-base-200 border-2 border-error/50 max-w-md mx-auto p-4 shadow">
    <div class="flex items-start gap-3">
      <div class="p-2 rounded-lg bg-error/20 text-error shrink-0">
        <component :is="resolveLucideIcon('TriangleAlert')" class="w-6 h-6" />
      </div>
      <div class="flex-1 space-y-1">
        <h4 class="font-bold text-sm text-error">{{ t('scenarioStep.unregisteredUi.title') }}</h4>
        <p class="text-xs font-mono bg-base-300 px-2 py-0.5 rounded inline-block">{{ uiKey }}</p>
        <p class="text-xs text-base-content/80">{{ t('scenarioStep.unregisteredUi.message', { uiKey }) }}</p>
        <p class="text-xs text-base-content/60">{{ t('scenarioStep.unregisteredUi.description') }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { resolveLucideIcon } from '@/common/LucideIcon/useLucideIcon'

  defineProps<{
    uiKey: string
  }>()

  const { t } = useI18n()
</script>
