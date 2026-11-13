<!-- src/ui/SnipeTimer/SnipeTimer.vue -->
<template>
  <SnipeTimerSelector
    :settings="settings"
    :state="state"
    :digits="digits"
    :fontFamily="appStore.data.ui.fontFamily"
    @toggle="toggle"
    @reset="reset"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { SnipeTimerSchema } from '@/types/ui'
  import SnipeTimerSelector from './SnipeTimerSelector.vue'
  import { useSnipeTimer } from './useSnipeTimer'

  const appStore = useAppStore()
  const settings = computed(() => SnipeTimerSchema.parse(appStore.data.ui?.settings?.snipeTimer ?? {}))

  const { state, digits, toggle, reset } = useSnipeTimer(settings)
</script>
