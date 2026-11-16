<!-- src/ui/LuckyDraw/LuckyDraw.vue -->
<!-- 参加者(slot0=join)を貯め、抽選(slot0=draw)で選んだ人を表示する。参加者はこの UI が持つ -->
<template>
  <LuckyDrawSelector
    :settings="settings"
    :state="state"
    :history="history"
    :fontFamily="appStore.data.ui.fontFamily"
    @draw="draw()"
    @clearHistory="clearHistory"
  />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { LuckyDrawSchema } from '@/types/ui'
  import LuckyDrawSelector from './LuckyDrawSelector.vue'
  import { useLuckyDraw } from './composables/useLuckyDraw'

  const appStore = useAppStore()
  const settings = computed(() => LuckyDrawSchema.parse(appStore.data.ui?.settings?.luckyDraw ?? {}))

  const { state, history, draw, clearHistory } = useLuckyDraw(settings)
</script>
