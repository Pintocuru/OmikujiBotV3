<!-- src/ui/UserBoard/layouts/TeamScore.vue -->
<!-- チームの得点 (チーム色ごとの大きな得点を、横に並べるスコアボード) -->
<template>
  <div v-if="bars.length > 0" class="flex gap-2 rounded-2xl p-2 shadow-xl" :style="boardRootStyle(settings)">
    <div
      v-for="bar in bars"
      :key="bar.team"
      class="flex min-w-28 flex-1 flex-col items-center gap-1 rounded-xl px-4 py-3 transition-all"
      :class="{ 'ring-4 ring-offset-2': isTop(bar) }"
      :style="{
        backgroundColor: teamColor(bar.team),
        color: teamContentColor(bar.team),
        '--tw-ring-color': 'var(--rk-accent)',
        '--tw-ring-offset-color': 'var(--rk-bg)',
      }"
    >
      <!-- 得点 -->
      <span class="text-4xl leading-none font-bold whitespace-nowrap">{{ formatScore(bar.totalScore) }}</span>
      <!-- 人数 -->
      <span class="text-sm opacity-80">{{ bar.memberCount }}人</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserStatsRecord } from '@/types/api'
  import type { UserBoardType } from '@/types/ui'
  import { buildTeamBars, type TeamBar } from '../scripts/boardData'
  import { boardRootStyle, teamColor, teamContentColor } from './boardStyle'

  const props = defineProps<{ users: UserStatsRecord[]; settings: UserBoardType }>()

  const bars = computed(() => buildTeamBars(props.users))
  const formatScore = (score: number) => score.toLocaleString('ja-JP', { maximumFractionDigits: 2 })

  // 1位のチーム (得点が 0 以下のときは、だれも強調しない。同点は、すべて強調する)
  const topScore = computed(() => Math.max(...bars.value.map((bar) => bar.totalScore)))
  const isTop = (bar: TeamBar) => topScore.value > 0 && bar.totalScore === topScore.value
</script>
