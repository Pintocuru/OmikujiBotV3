<!-- src/ui/StreamCounter/editor/StreamCounterPreview.vue -->
<template>
  <HudPreview maxHeightClass="h-42">
    <div :class="[fontFamily]">
      <StreamCounterSelector
        :key="streamCounter.labelStyle"
        :settings="streamCounter"
        :counters="previewCounters"
        :variable-labels="variableLabels"
      />
    </div>

    <template #hud>
      <button class="btn btn-xs btn-ghost" @click="incrementAll">🎲 +1</button>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { type StreamCounterType } from '@/types/ui'
  import { useFontFamily } from '@/types/OmikujiData'
  import StreamCounterSelector from '@/ui/StreamCounter/StreamCounterSelector.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { usePreviewCounters } from './usePreviewCounters'

  const props = defineProps<{
    streamCounter: StreamCounterType
    variableLabels: Record<string, string>
  }>()

  const { previewCounters, incrementAll } = usePreviewCounters({
    getExtraKeys: () => props.streamCounter.eventCounters,
  })

  const omikujiStore = useOmikujiStore()
  const fontFamily = computed(() => useFontFamily(omikujiStore.data.ui.fontFamily ?? 'default'))
  const variableLabels = computed(() => props.variableLabels)
</script>
