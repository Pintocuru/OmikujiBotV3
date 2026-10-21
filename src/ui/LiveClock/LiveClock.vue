<!-- src/ui/LiveClock/LiveClock.vue -->
<template>
  <LiveClockSelector
    :settings="settings"
    :default-message="defaultMessage"
    :is-mounted="isMounted"
    :is-flipped="isFlipped"
    :current-msg="currentMsg"
  />
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
  import { LiveClockSchema } from '@/types/ui'
  import LiveClockSelector from './LiveClockSelector.vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { useBotDisplay } from '@/ui/common/useBotDisplay'
  import { useFilteredBotMessages } from '../common/useFilteredBotMessages'
  import { usePlaceholderInterval } from '../common/usePlaceholderInterval'

  const appStore = useAppStore()

  const settings = computed(() => LiveClockSchema.parse(appStore.data.ui?.settings?.liveClock ?? {}))

  const { messages } = useFilteredBotMessages('liveClock', {
    userIconSize: 6,
  })
  const { displayedComments, start, stop } = useBotDisplay(messages)

  const {
    message: defaultMessage,
    commitIfPending,
    registerIntervalHook,
  } = usePlaceholderInterval(() => settings.value.defaultMessage ?? '')

  registerIntervalHook(() => {
    commitIfPending(!isFlipped.value)
  })

  // 時計
  const isMounted = ref(false)

  // フリップ制御（表示秒数は useBotDisplay が管理し、最新メッセージの display.visible に追従する）
  const latest = computed(() => displayedComments.value[0])
  const isFlipped = computed(() => latest.value?.display.visible ?? false)

  // Leave 中も文言を保持するため、最新メッセージの文言は ref に保持する
  const currentMsg = ref('')
  watch(latest, (msg) => {
    if (msg?.bubble?.message) currentMsg.value = msg.bubble.message
  })

  // ライフサイクル

  onMounted(() => {
    //startLiveClock()
    start()

    requestAnimationFrame(() => {
      isMounted.value = true
    })
  })

  onUnmounted(() => {
    // stopLiveClock()
    stop()
  })
</script>
