<!-- src/editor/apps/appItems/preview/TimerIntervalPreview.vue -->
<template>
  <div class="space-y-1.5 min-w-45 max-w-60">
    <!-- ヘッダー -->
    <div class="flex items-center gap-1.5 text-xs font-semibold opacity-70 pb-0.5 border-b border-base-300">
      <Clock class="w-3 h-3" />
      <span>{{ t('appPreview.timer.title') }}</span>
    </div>

    <!-- モード -->
    <div class="flex items-center gap-1.5 text-xs">
      <Play class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">{{ t('appPreview.mode') }}</span>
      <span class="badge badge-xs" :class="data?.mode === 'onStart' ? 'badge-accent' : 'badge-primary'">
        {{ data?.mode === 'onStart' ? t('appPreview.timer.onStart') : t('appPreview.timer.interval') }}
      </span>
    </div>

    <!-- 間隔 -->
    <div v-if="data?.mode !== 'onStart'" class="flex items-center gap-1.5 text-xs">
      <Timer class="w-3 h-3 shrink-0 opacity-60" />
      <span class="opacity-70">{{ t('appPreview.timer.intervalLabel') }}</span>
      <span class="font-mono">{{ formatInterval(data?.intervalSeconds) }}</span>
      <span v-if="data?.isBaseZero" class="badge badge-xs badge-ghost">{{ t('appPreview.timer.baseZero') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useI18n } from 'vue-i18n'
  import { TimerEventType } from '@/types/OmikujiData'
  import { Clock, Play, Timer } from 'lucide-vue-next'

  const { t } = useI18n()

  defineProps<{
    data: Partial<TimerEventType> | null
  }>()

  function formatInterval(seconds?: number) {
    if (!seconds) return '—'
    if (seconds < 60) return t('appPreview.timer.sec', { n: seconds })
    if (seconds < 3600) return t('appPreview.timer.min', { n: Math.floor(seconds / 60) })
    return t('appPreview.timer.hour', { n: Math.floor(seconds / 3600) })
  }
</script>
