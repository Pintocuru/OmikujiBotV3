<!-- src/ui/StreamCounter/StreamCounter.vue -->
<template>
  <StreamCounterSelector :settings="liverSettings" :counters="counters" :variable-labels="variableLabels" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { storeToRefs } from 'pinia'
  import { useAppStore } from '@/generator/stores/useAppStore'

  import StreamCounterSelector from './StreamCounterSelector.vue'
  import { StreamCounterSchema } from '@/types/ui'
  import { useStreamCounters } from '@/ui/common/useStreamCounters'

  const appStore = useAppStore()
  const { data } = storeToRefs(appStore)

  const liverSettings = computed(() => StreamCounterSchema.parse(data.value.ui.settings.streamCounter ?? {}))

  const variableLabelMap = computed<Record<string, string>>(() =>
    Object.fromEntries(liverSettings.value?.variableCounters.map((c) => [c.target, c.label]))
  )

  const { counters, variableLabels } = useStreamCounters(variableLabelMap)
</script>
