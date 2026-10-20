<!-- src/ui/StreamCounter/StreamCounter.vue -->
<template>
  <StreamCounterSelector
    :settings="liverSettings"
    :counters="counters"
    :event-labels="eventLabels"
    :variable-labels="variableLabels"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/generator/stores/useAppStore'

  import StreamCounterSelector from './StreamCounterSelector.vue'
  import { StreamCounterSchema } from '../types'
  import { useStreamCounters } from '../common/useStreamCounters'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const liverSettings = computed(() => StreamCounterSchema.parse(data.value.ui.settings.streamCounter ?? {}))

  const eventKeys = computed(() => liverSettings.value?.eventCounters ?? [])

  const variableLabelMap = computed<Record<string, string>>(() =>
    Object.fromEntries(liverSettings.value?.variableCounters.map((c) => [c.target, c.label]))
  )

  const { counters, eventLabels, variableLabels } = useStreamCounters(eventKeys, variableLabelMap)
</script>
