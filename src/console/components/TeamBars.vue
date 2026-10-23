<!-- src/console/components/TeamBars.vue -->
<!-- チームごとの合計得点 (チーム色ごとのバー) -->
<template>
  <section class="rounded-box bg-base-200 p-3">
    <h2 class="mb-2 text-sm font-bold">チーム合計</h2>
    <p v-if="totals.length === 0" class="text-sm opacity-60">
      チームを割り当てると、ここに合計得点が出ます(ユーザーの色ボタンで割り当て)
    </p>
    <ul v-else class="flex flex-col gap-1.5">
      <li v-for="total in totals" :key="total.team" class="flex items-center gap-2 text-sm">
        <span class="w-20 shrink-0 truncate">{{ TEAM_STYLE[total.team].label }}</span>
        <div class="h-5 grow rounded bg-base-300">
          <div
            class="h-5 rounded px-2 text-right text-xs leading-5"
            :class="TEAM_STYLE[total.team].solid"
            :style="{ width: barWidth(total.totalScore) }"
          />
        </div>
        <span class="w-28 shrink-0 text-right font-mono">{{ formatNumber(total.totalScore) }}点 / {{ total.memberCount }}人</span>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { formatNumber } from '../scripts/summarizeState'
  import { TEAM_STYLE, type TeamTotal } from '../scripts/userConsole'

  const props = defineProps<{ totals: TeamTotal[] }>()

  const maxScore = computed(() => Math.max(...props.totals.map((t) => t.totalScore), 1))
  // マイナスの合計や、0 点のチームも、最低限の幅で見えるようにする
  const barWidth = (score: number) => `${Math.max((Math.max(score, 0) / maxScore.value) * 100, 2)}%`
</script>
