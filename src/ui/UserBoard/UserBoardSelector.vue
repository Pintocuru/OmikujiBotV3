<!-- src/ui/UserBoard/UserBoardSelector.vue -->
<template>
  <div class="relative" :class="useFontFamily(fontFamily)">
    <component :is="currentComponent" :users="users" :settings="settings" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserStatsRecord } from '@/types/api'
  import { FontFamilyType } from '@/types/OmikujiData'
  import { useFontFamily } from '@/common/FontFamily/fontFamily'
  import type { UserBoardComponent, UserBoardType } from '@/types/ui'
  import ranking from './layouts/Ranking.vue'
  import teamBar from './layouts/TeamBar.vue'
  import teamScore from './layouts/TeamScore.vue'

  const props = defineProps<{
    users: UserStatsRecord[]
    settings: UserBoardType
    fontFamily?: FontFamilyType
  }>()

  const componentMap: Record<UserBoardComponent, any> = {
    ranking,
    teamBar,
    teamScore,
  }

  const currentComponent = computed(() => componentMap[props.settings.component] ?? ranking)
</script>
