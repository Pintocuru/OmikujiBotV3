<!-- src/console/users/components/TeamBars.vue -->
<!-- チームごとの合計得点 (チーム色ごとのバー) -->
<template>
  <section v-if="totals.length !== 0" class="rounded-box bg-base-200 p-3">
    <h2 class="mb-2 text-sm font-bold">{{ usersMessages.teamBars.title }}</h2>
    <ul class="flex flex-col gap-1.5">
      <li v-for="total in totals" :key="total.team" class="flex items-center gap-2 text-sm">
        <span class="w-20 shrink-0 truncate">{{ teamLabel(total.team) }}</span>
        <div class="h-5 grow rounded bg-base-300">
          <div
            class="h-5 rounded px-2 text-right text-xs leading-5"
            :class="TEAM_STYLE[total.team].solid"
            :style="{ width: barWidth(total.totalScore) }"
          />
        </div>
        <span class="w-28 shrink-0 text-right font-mono">{{
          usersMessages.teamBars.total(formatNumber(total.totalScore), total.memberCount)
        }}</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { formatNumber } from '@/console/common/scripts/formatters'
  import type { TeamTotal } from '@/console/types'
  import type { DaisyUIColorType } from '@/types/core'
  import { usersMessages } from '../maps/UsersMessageMap'
  import { TEAM_STYLE } from '../scripts/userConsole'

  const props = defineProps<{ totals: TeamTotal[]; teamLabel: (team: DaisyUIColorType) => string }>()

  const maxScore = computed(() => Math.max(...props.totals.map((t) => t.totalScore), 1))
  // マイナスの合計や、0 点のチームも、最低限の幅で見えるようにする
  const barWidth = (score: number) => `${Math.max((Math.max(score, 0) / maxScore.value) * 100, 2)}%`
</script>
