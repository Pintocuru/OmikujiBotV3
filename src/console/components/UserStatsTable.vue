<!-- src/console/components/UserStatsTable.vue -->
<template>
  <p v-if="rows.length === 0" class="py-8 text-center opacity-60">まだ記録がありません</p>
  <div v-else class="overflow-x-auto">
    <table class="table table-zebra table-sm">
      <thead>
        <tr>
          <th>ユーザー</th>
          <th class="text-right">回数</th>
          <th class="text-right">累計ポイント</th>
          <th class="text-right">自己ベスト</th>
          <th class="text-right">最後に遊んだ時刻</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="row in rows" :key="row.userId">
          <td>{{ row.userName }}</td>
          <td class="text-right font-mono">{{ formatNumber(row.totalDraws) }}</td>
          <td class="text-right font-mono">{{ formatNumber(row.totalPoints) }}</td>
          <td class="text-right font-mono">{{ formatNumber(row.bestScore) }}</td>
          <td class="text-right text-xs opacity-70">{{ formatDateTime(row.lastPlayedAt) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { GameStateType } from '@/types/api'
  import { buildUserRows, formatDateTime, formatNumber } from '../scripts/summarizeState'

  const props = defineProps<{ state: GameStateType }>()
  const rows = computed(() => buildUserRows(props.state))
</script>
