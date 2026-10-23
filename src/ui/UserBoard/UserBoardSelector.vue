<!-- src/ui/UserBoard/UserBoardSelector.vue -->
<template>
  <div class="relative" :class="useFontFamily(fontFamily)">
    <component :is="currentBoard" :users="users" :settings="settings" />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserStatsRecord } from '@/types/api'
  import { FontFamilyType, useFontFamily } from '@/types/OmikujiData'
  import type { UserBoardKind, UserBoardType } from '@/types/ui'
  import RankingBoard from './layouts/RankingBoard.vue'
  import SeatBoard from './layouts/SeatBoard.vue'
  import TeamBoard from './layouts/TeamBoard.vue'

  const props = defineProps<{
    users: UserStatsRecord[]
    settings: UserBoardType
    fontFamily?: FontFamilyType
  }>()

  const boardMap: Record<UserBoardKind, any> = {
    ranking: RankingBoard,
    team: TeamBoard,
    seats: SeatBoard,
  }

  const currentBoard = computed(() => boardMap[props.settings.board] ?? RankingBoard)
</script>
