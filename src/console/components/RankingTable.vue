<!-- src/console/components/RankingTable.vue -->
<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-4">
      <div class="join">
        <button
          v-for="(name, key) in sortOrders"
          :key="key"
          class="btn btn-sm join-item"
          :class="{ 'btn-primary': sortOrder === key }"
          @click="sortOrder = key"
        >
          {{ name }}
        </button>
      </div>
      <label class="label cursor-pointer gap-2 text-sm">
        <input v-model="unique" type="checkbox" class="toggle toggle-sm toggle-primary" />
        ユーザーごとに1件
      </label>
      <label class="label gap-2 text-sm">
        表示件数
        <input v-model.number="limit" type="number" min="1" max="200" class="input input-sm input-bordered w-20" />
      </label>
    </div>

    <p v-if="rows.length === 0" class="py-8 text-center opacity-60">まだ記録がありません</p>
    <div v-else class="overflow-x-auto">
      <table class="table table-zebra table-sm">
        <thead>
          <tr>
            <th class="w-16">順位</th>
            <th>ユーザー</th>
            <th class="text-right">得点</th>
            <th class="text-right">記録時刻</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in rows" :key="row.logId">
            <td class="font-mono">{{ medal(row.rank) }}</td>
            <td>{{ row.userName }}</td>
            <td class="text-right font-mono">
              {{ row.label }}
              <span v-if="row.label !== String(row.score)" class="ml-1 text-xs opacity-50">({{ formatNumber(row.score) }})</span>
            </td>
            <td class="text-right text-xs opacity-70">{{ formatDateTime(row.createdAt) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import type { GameStateType } from '@/types/api'
  import { buildRanking, formatDateTime, formatNumber, type RankingSortOrder } from '../scripts/summarizeState'

  const props = defineProps<{ state: GameStateType }>()

  const sortOrders: Record<RankingSortOrder, string> = { high: '高い順', low: '低い順', new: '新しい順' }
  const sortOrder = ref<RankingSortOrder>('high')
  const unique = ref(true)
  const limit = ref(20)

  const rows = computed(() =>
    buildRanking(props.state, {
      sortOrder: sortOrder.value,
      unique: unique.value,
      limit: Math.min(Math.max(Number(limit.value) || 1, 1), 200),
    })
  )

  const medal = (rank: number) => (rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : String(rank))
</script>
