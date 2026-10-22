<!-- src/ui/GameRanking/layouts/SuikaGame.vue -->
<template>
  <!-- スコア表示（バブル） -->
  <div class="flex justify-center">
    <GameRankingScore
      v-if="scoreMessages.length > 0"
      :key="scoreMessages.length"
      :scoreMessages="scoreMessages"
      :settings="settings"
      class="-mb-4"
    />
  </div>

  <!-- ランキングリスト -->
  <GameRankingList :listMessages="listMessages" :settings="settings" medal />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageRankingType } from '@/types/generator'
  import { GameRankingType } from '@/types/ui'
  import { uniqueByLatestUser } from '../scripts/uniqueByLatestUser'
  import GameRankingScore from './RankStandard/GameRankingScore.vue'
  import GameRankingList from './RankStandard/GameRankingList.vue'

  const props = defineProps<{
    rankingMessages: BotMessageRankingType[]
    settings: GameRankingType
  }>()

  // スコア表示用
  const scoreMessages = computed(() => props.rankingMessages)

  // リスト表示用
  const listMessages = computed(() =>
    props.settings.uniqueUser ? uniqueByLatestUser(props.rankingMessages) : props.rankingMessages
  )
</script>
