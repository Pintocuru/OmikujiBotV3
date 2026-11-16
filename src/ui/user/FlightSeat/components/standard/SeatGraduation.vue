<!-- src/ui/FlightSeat/components/standard/SeatGraduation.vue -->
<template>
  <div class="flex flex-col items-center gap-3">
    <div
      v-for="(count, row) in layout"
      :key="row"
      class="grid gap-3 mx-auto"
      :style="{ gridTemplateColumns: `repeat(${count}, 5rem)` }"
    >
      <SeatCell
        v-for="col in count"
        :key="seatAt(row, col)?.lastVisit ?? `${row}-${col}`"
        :seat="seatAt(row, col)"
        :index="rowOffset(row) + col - 1"
        :statKey="statKey"
        :colorFrom="(col - 1) % 2 === 0 ? palette.even : palette.odd"
        :textColor="palette.text"
      />
    </div>

    <!-- フッター装飾 -->
    <div class="flex items-center gap-2 w-full px-4">
      <div class="flex-1 border-t border-current opacity-20" />
      <span class="text-xs opacity-30">✦ ✦ ✦</span>
      <div class="flex-1 border-t border-current opacity-20" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import type { UserStatsRecord } from '@/types/api'
  import type { FlightSeatStatKey } from '@/types/ui'
  import SeatCell from './parts/SeatCell.vue'
  import { computed } from 'vue'
  import type { CharacterColorType } from '@/types/OmikujiData/'
  import { createSeatPalette } from '../../composables/seatColors'

  const props = defineProps<{
    color: CharacterColorType
    seats: (UserStatsRecord | null)[]
    statKey: FlightSeatStatKey | null
    customLayout?: number[]
  }>()

  const palette = computed(() => createSeatPalette(props.color))

  // 後列12 / 前列13 / 壇上12
  const layout = props.customLayout ?? ([12, 13, 12] as const)

  const rowOffset = (row: number) => layout.slice(0, row).reduce((sum, n) => sum + n, 0)

  const seatAt = (row: number, col: number): UserStatsRecord | null => props.seats[rowOffset(row) + col - 1] ?? null
</script>
