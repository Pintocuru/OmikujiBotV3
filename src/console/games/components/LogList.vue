<!-- src/console/games/components/LogList.vue -->
<template>
  <p v-if="rows.length === 0" class="py-8 text-center opacity-60">まだ記録がありません</p>
  <ul v-else class="flex flex-col divide-y divide-base-300">
    <li v-for="row in rows" :key="row.logId" class="flex items-baseline gap-3 py-1.5 text-sm">
      <span class="w-20 shrink-0 font-mono text-xs opacity-60">{{ formatTime(row.createdAt) }}</span>
      <span class="grow truncate">{{ row.userName }}</span>
      <span class="font-mono">{{ row.label }}</span>
      <span v-if="row.label !== String(row.score)" class="font-mono text-xs opacity-50"
        >({{ formatNumber(row.score) }})</span
      >
    </li>
  </ul>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { GameStateType } from '@/types/api'
  import { formatNumber, formatTime } from '@/console/common/scripts/formatters'
  import { buildLogRows } from '../scripts/summarizeState'

  const props = defineProps<{ state: GameStateType }>()
  const rows = computed(() => buildLogRows(props.state))
</script>
