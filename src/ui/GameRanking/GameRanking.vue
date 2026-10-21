<!-- src/ui/GameRanking/GameRanking.vue -->
<template>
  <GameRankingSelector
    :botMessageExtras="targetRankingMessages"
    :settings="rankingSettings"
    :fontFamily="appStore.data.ui.fontFamily"
  />
</template>

<script setup lang="ts">
  import { computed, ComputedRef } from 'vue'
  import { GameRankingSchema } from '@/types/ui'
  import { storeToRefs } from 'pinia'
  import { BotMessageExtraType } from '@/generator/types'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import GameRankingSelector from './GameRankingSelector.vue'

  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)

  const rankingSettings = computed(() => GameRankingSchema.parse(appStore.data.ui?.settings?.gameRanking ?? {}))

  const rankingMessages: ComputedRef<BotMessageExtraType[]> = computed(() => {
    return botMessages.value.filter((message): message is BotMessageExtraType => message.type === 'extra')
  })

  const targetRankingMessages = computed<BotMessageExtraType[]>(() => {
    return rankingMessages.value
  })
</script>
