<!-- src/ui/GameRanking/GameRankingSelector.vue -->
<template>
  <div class="relative" :class="useFontFamily(fontFamily)">
    <component :is="currentComponent" :rankingMessages="rankingMessages" :settings="settings" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { RankingComponent, GameRankingType } from '@/types/ui'
  import { BotMessageRankingType } from '@/types/generator'
  import suikaGame from './layouts/SuikaGame.vue'
  import standard from './layouts/Standard.vue'
  import { FontFamilyType } from '@/types/OmikujiData'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'

  const props = defineProps<{
    rankingMessages: BotMessageRankingType[]
    settings: GameRankingType
    fontFamily?: FontFamilyType
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
