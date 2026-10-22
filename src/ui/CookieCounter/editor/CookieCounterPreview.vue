<!-- src/ui/CookieCounter/editor/CookieCounterPreview.vue -->
<template>
  <HudPreview :defaultScale="0.8">
    <div :class="[fontFamily]">
      <CookieCounterSelector
        :key="cookieCounter.component"
        :settings="cookieCounter"
        :counters="previewCounters"
        :variableLabels="variableLabels"
      />
    </div>

    <template #hud>
      <div class="flex items-center gap-2">
        <button class="btn btn-xs btn-ghost" @click="incrementAll">🎲 全て +1</button>
      </div>
    </template>
  </HudPreview>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useFontFamily } from '@/types/OmikujiData'
  import type { CookieCounterType } from '@/types/ui'
  import CookieCounterSelector from '@/ui/CookieCounter/CookieCounterSelector.vue'
  import HudPreview from '@/editor/parts/HudPreview.vue'
  import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
  import { usePreviewCounters } from '@/ui/StreamCounter/editor/usePreviewCounters'

  const props = defineProps<{
    cookieCounter: CookieCounterType
    variableLabels: Record<string, string>
  }>()

  const { previewCounters, incrementAll } = usePreviewCounters({
    getExtraKeys: () => props.cookieCounter.counters.map((c) => c.target),
  })

  const omikujiStore = useOmikujiStore()
  const fontFamily = computed(() => useFontFamily(omikujiStore.data.ui.fontFamily ?? 'default'))
</script>
