<!-- src/ui/LiverBingo/LiverBingo.vue -->
<template>
  <LiverBingoBoard :settings="settings" :fontFamily="appStore.data.ui.fontFamily" sync />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { LiverBingoSchema } from '@/types/ui'
  import LiverBingoBoard from './components/LiverBingoBoard.vue'

  const appStore = useAppStore()
  const settings = computed(() => LiverBingoSchema.parse(appStore.data.ui?.settings?.liverBingo ?? {}))
</script>
