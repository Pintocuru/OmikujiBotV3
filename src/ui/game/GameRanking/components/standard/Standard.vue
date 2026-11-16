<!-- src/ui/GameRanking/components/standard/Standard.vue -->
<template>
  <GameRankingList :listMessages="listMessages" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { BotMessageRankingType } from '@/types/generator'
  import { GameRankingType } from '@/types/ui'
  import { uniqueByLatestUser } from '../../scripts/uniqueByLatestUser'
  import GameRankingList from '../../parts/GameRankingList.vue'

  const props = defineProps<{
    rankingMessages: BotMessageRankingType[]
    settings: GameRankingType
  }>()

  const listMessages = computed(() =>
    props.settings.uniqueUser ? uniqueByLatestUser(props.rankingMessages) : props.rankingMessages
  )
</script>
