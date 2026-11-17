<!-- src/ui/bot/LiveClock/LiveClock.vue -->
<template>
  <LiveClockSelector
    :settings="settings"
    :slot-message="slotMessage"
    :is-mounted="isMounted"
    :is-flipped="isFlipped"
    :current-msg="currentMsg"
    :fontFamily="appStore.data.ui.fontFamily"
  />
</template>

<script setup lang="ts">
  import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
  import { LiveClockSchema } from '@/types/ui'
  import LiveClockSelector from './LiveClockSelector.vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { useBotDisplay } from '@/ui/common/useBotDisplay'
  import { useFilteredBotMessages } from '@/ui/common/useFilteredBotMessages'

  const appStore = useAppStore()

  const settings = computed(() => LiveClockSchema.parse(appStore.data.ui?.settings?.liveClock ?? {}))

  const { messages } = useFilteredBotMessages('liveClock', {
    userIconSize: 6,
  })
  const { displayedComments, start, stop } = useBotDisplay(messages)

  // 時計の下のメッセージ: 最新の slot0 を保持する(届くまでは空=非表示)
  const slotMessage = ref('')
  watch(
    messages,
    (list) => {
      for (let i = list.length - 1; i >= 0; i--) {
        const text = String(list[i].slots?.slot0 ?? '').trim()
        if (text) {
          slotMessage.value = text
          return
        }
      }
    },
    { immediate: true }
  )

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
