<!-- src/ui/ToastWidgets/ToastWidgets.vue -->
<template>
  <!-- トースト表示 -->
  <ViewBotToast />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { ToastWidgetsSchema } from '@/ui/types'
  import ViewBotToast from './ViewBotToast.vue'
  import { useAppStore } from '@/generator/stores/useAppStore'

  const appStore = useAppStore()
  const toastSettings = computed(() => ToastWidgetsSchema.parse(appStore.data.ui.settings.toastWidgets ?? {}))
</script>
