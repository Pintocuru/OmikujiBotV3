<!-- src/editor/apps/appItems/preview/PadTriggerPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-45 max-w-60">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <Filter class="w-3 h-3" />
      <span>{{ t('appPreview.threshold.title') }}</span>
    </div>

    <div v-if="padId" class="flex items-center gap-1.5 text-xs">
      <LayoutGrid class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">{{ t('padTrigger.preview') }}</span>
      <span class="badge badge-xs badge-primary">{{ padId.replace('pad-', '') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { Filter, LayoutGrid } from 'lucide-vue-next'
  import type { PadTriggerType } from '@/types/OmikujiData'

  const { t } = useI18n()

  const props = defineProps<{
    data: { trigger?: Partial<PadTriggerType> } | null
  }>()

  const padId = computed(() => props.data?.trigger?.padId ?? null)
</script>
