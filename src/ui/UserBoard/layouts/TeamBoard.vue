<!-- src/ui/UserBoard/layouts/TeamBoard.vue -->
<!-- チーム合計 (チーム色ごとのバー) -->
<template>
  <div v-if="bars.length > 0" class="flex flex-col gap-2 rounded-2xl p-3 shadow-xl" :style="boardRootStyle(settings)">
    <div v-for="bar in bars" :key="bar.team" class="flex items-center gap-2">
      <!-- バー: 長さは、一番高いチームを 100% とした比率 -->
      <div class="h-9 grow rounded-lg" :style="{ backgroundColor: mix('var(--rk-text)', 12) }">
        <div
          class="flex h-9 items-center justify-end rounded-lg px-3 text-lg font-bold transition-all duration-700"
          :style="{
            width: `${bar.ratio * 100}%`,
            backgroundColor: teamColor(bar.team),
            color: teamContentColor(bar.team),
          }"
        >
          <span class="whitespace-nowrap">{{ formatScore(bar.totalScore) }}</span>
        </div>
      </div>
      <span class="w-12 shrink-0 text-right text-sm">{{ bar.memberCount }}人</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserStatsRecord } from '@/types/api'
  import type { UserBoardType } from '@/types/ui'
  import { buildTeamBars } from '../scripts/boardData'
  import { boardRootStyle, mix, teamColor, teamContentColor } from './boardStyle'

  const props = defineProps<{ users: UserStatsRecord[]; settings: UserBoardType }>()

  const bars = computed(() => buildTeamBars(props.users))
  const formatScore = (score: number) => score.toLocaleString('ja-JP', { maximumFractionDigits: 2 })
</script>
