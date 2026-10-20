<!-- src/MainGenerator/ui/KujibikiPanel/KujibikiPanel.vue -->
<template>
  <KujibikiPanelSelector :settings="settings" :messages="activeMessages" />
</template>

<script setup lang="ts">
  import { computed, onMounted, onUnmounted } from 'vue'
  import { KujibikiPanelSchema } from '@/ui/types'
  import KujibikiPanelSelector from './KujibikiPanelSelector.vue'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'
  import { useBotDisplay } from '../CommentBubble/generator/composables/useBotDisplay'

  import { useAppStore } from '@/generator/stores/useAppStore'

  const appStore = useAppStore()
  const settings = computed(() => KujibikiPanelSchema.parse(appStore.data.ui?.settings?.kujibikiPanel ?? {}))

  const { messages } = useFilteredBotMessages('kujibikiPanel', {
    displaySeconds: settings.value.displaySeconds,
    userIconSize: 12,
  })

  // displaySeconds === 0 → 常時表示（常に最新メッセージ1件を直接参照）
  // displaySeconds !== 0 → useBotDisplay 経由でタイムアウト管理
  const isAlwaysOn = computed(() => settings.value.displaySeconds === 0)

  const { displayedComments, start, stop } = useBotDisplay(messages)

  // 常時表示モードでは messages の最新1件、そうでなければ displayedComments を使用
  const activeMessages = computed(() => (isAlwaysOn.value ? messages.value.slice(-1) : displayedComments.value))

  onMounted(() => {
    if (!isAlwaysOn.value) start()
  })

  onUnmounted(() => {
    if (!isAlwaysOn.value) stop()
  })
</script>
