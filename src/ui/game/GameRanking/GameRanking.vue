<!-- src/ui/GameRanking/GameRanking.vue -->
<template>
  <GameRankingSelector
    :rankingMessages="rankingMessages"
    :settings="rankingSettings"
    :fontFamily="appStore.data.ui.fontFamily"
  />
</template>

<script setup lang="ts">
  import { computed, ComputedRef } from 'vue'
  import { GameRankingSchema } from '@/types/ui'
  import { storeToRefs } from 'pinia'
  import { BotMessageRankingType, toRankingEntry } from '@/types/generator'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import GameRankingSelector from './GameRankingSelector.vue'
  import { useGameLogSaver } from './scripts/useGameLogSaver'

  const appStore = useAppStore()
  const { botMessages } = storeToRefs(appStore)

  const rankingSettings = computed(() => GameRankingSchema.parse(appStore.data.ui?.settings?.gameRanking ?? {}))

  const rankingMessages: ComputedRef<BotMessageRankingType[]> = computed(() => {
    // UI が受け取る時に、汎用の slots を ranking へコンバートする
    return botMessages.value.flatMap((message) => {
      const entry = toRankingEntry(message)
      return entry ? [entry] : []
    })
  })

  // ランキングに関係するメッセージを受け取るたびに、API でゲームログを保存する
  useGameLogSaver(rankingMessages)
</script>
