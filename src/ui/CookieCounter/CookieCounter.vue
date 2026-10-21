<!-- src/ui/CookieCounter/CookieCounter.vue -->
<template>
  <CookieCounterSelector :settings="cookieSettings" :counters="counters" :variable-labels="variableLabels" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import CookieCounterSelector from './CookieCounterSelector.vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { CookieCounterSchema } from '@/types/ui'
  import { useStreamCounters } from '@/ui/common/useStreamCounters'

  const appStore = useAppStore()
  const cookieSettings = computed(() => CookieCounterSchema.parse(appStore.data.ui.settings.cookieCounter ?? {}))

  // type: 'variable' の { target → label } マップ
  const variableLabelMap = computed<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const c of cookieSettings.value.counters) {
      if (c.type === 'variable') {
        map[c.target] = c.label
      }
    }
    return map
  })

  const { counters, variableLabels } = useStreamCounters(variableLabelMap)
</script>
