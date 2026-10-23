<!-- src/ui/UserBoard/layouts/RankingBoard.vue -->
<!-- 個人ランキング -->
<template>
  <div v-if="rows.length > 0" class="flex flex-col gap-1 rounded-2xl p-2 shadow-xl" :style="boardRootStyle(settings)">
    <div
      v-for="row in rows"
      :key="row.user.userId"
      class="flex items-center gap-1.5 rounded-lg p-1 transition-all"
      :style="getRowStyle(row.rank)"
    >
      <!-- 順位 -->
      <div
        class="ml-1 inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-lg px-2 text-sm font-bold"
        :style="getRankBadgeStyle(row.rank)"
      >
        {{ row.rank }}
      </div>

      <UserAvatar :user="row.user" :size="28" />

      <!-- チーム色 -->
      <span
        v-if="row.user.team"
        class="inline-block h-3 w-3 shrink-0 rounded-full"
        :style="{ backgroundColor: teamColor(row.user.team) }"
      />

      <!-- 名前 -->
      <span class="min-w-0 grow truncate font-bold" :style="{ color: 'var(--rk-name)' }">{{ row.user.userName }}</span>

      <!-- 得点 -->
      <span class="inline-flex h-8 shrink-0 items-center rounded-lg px-3 text-lg font-bold" :style="scoreBadgeStyle">
        {{ formatScore(row.user.score) }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserStatsRecord } from '@/types/api'
  import type { UserBoardType } from '@/types/ui'
  import { buildRanking } from '../scripts/boardData'
  import { boardRootStyle, mix, teamColor } from './boardStyle'
  import UserAvatar from './UserAvatar.vue'

  const props = defineProps<{ users: UserStatsRecord[]; settings: UserBoardType }>()

  const rows = computed(() => buildRanking(props.users, props.settings.limit))

  const formatScore = (score: number) => score.toLocaleString('ja-JP', { maximumFractionDigits: 2 })

  // 上位3位の行の背景(accent の濃淡で表現)
  const RANK_ROW_ALPHA = [70, 45, 25] as const
  const getRowStyle = (rank: number) => {
    const alpha = RANK_ROW_ALPHA[rank - 1]
    return alpha ? { backgroundColor: mix('var(--rk-accent)', alpha) } : {}
  }
  const getRankBadgeStyle = (rank: number) =>
    rank <= RANK_ROW_ALPHA.length
      ? { backgroundColor: 'var(--rk-accent)', color: 'var(--rk-bg)' }
      : { backgroundColor: mix('var(--rk-text)', 15), color: 'var(--rk-text)' }

  const scoreBadgeStyle = computed(() => ({ backgroundColor: mix('var(--rk-accent)', 25), color: 'var(--rk-text)' }))
</script>
