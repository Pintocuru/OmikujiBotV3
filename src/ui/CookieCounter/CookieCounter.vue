<!-- src/ui/CookieCounter/CookieCounter.vue -->
<template>
  <CookieCounterSelector
    :settings="cookieSettings"
    :counters="counters"
    :event-labels="eventLabels"
    :variable-labels="variableLabels"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  import CookieCounterSelector from './CookieCounterSelector.vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { CookieCounterSchema } from '@/types/ui'
  import { useStreamCounters } from '@/ui/common/useStreamCounters'

  const appStore = useAppStore()
  const cookieSettings = computed(() => CookieCounterSchema.parse(appStore.data.ui.settings.cookieCounter ?? {}))

  // type: 'event' のターゲットキー一覧
  const eventKeys = computed<string[]>(() =>
    cookieSettings.value.counters.filter((c) => c.type === 'event').map((c) => c.target)
  )

  // type: 'variable' の { target → label } マップ
  const variableLabelMap = computed<Record<string, string>>(() =>
    Object.fromEntries(
      cookieSettings.value.counters.filter((c) => c.type === 'variable').map((c) => [c.target, c.label])
    )
  )

  const { counters, eventLabels, variableLabels } = useStreamCounters(eventKeys, variableLabelMap)
</script>
