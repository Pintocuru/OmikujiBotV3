<!-- src/ui/GameRanking/generator/parts/GameRankingSelector.vue -->
<template>
  <component :is="currentComponent" :botMessageExtra="botMessageExtras" :settings="settings" />
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RankingComponent, GameRankingType } from '@/ui/types'
  import { BotMessageExtraType } from '@/generator/types'
  import suikaGame from './layouts/SuikaGame.vue'
  import standard from './layouts/Standard.vue'

  const props = defineProps<{
    botMessageExtras: BotMessageExtraType[]
    settings: GameRankingType
  }>()

  const componentMap: Record<RankingComponent, any> = {
    suikaGame,
    standard,
  }

  const currentComponent = computed(() => {
    const component = props.settings.component || 'suikaGame'
    return componentMap[component] || suikaGame
  })
</script>
