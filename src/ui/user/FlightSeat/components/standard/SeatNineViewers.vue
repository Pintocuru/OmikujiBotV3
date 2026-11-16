<!-- src/ui/FlightSeat/components/standard/SeatNineViewers.vue -->
<template>
  <div class="flex flex-col items-center gap-3">
    <div
      v-for="(row, rowIndex) in layout"
      :key="rowIndex"
      class="grid gap-3 justify-center"
      :style="{
        gridTemplateColumns: `repeat(${row}, 5rem)`,
      }"
    >
      <SeatCell
        v-for="colIndex in row"
        :key="displaySeats[getIndex(rowIndex, colIndex - 1)]?.lastVisit ?? getIndex(rowIndex, colIndex - 1)"
        :seat="displaySeats[getIndex(rowIndex, colIndex - 1)]"
        :index="getIndex(rowIndex, colIndex - 1)"
        :statKey="statKey"
        :colorFrom="checkerColor(getIndex(rowIndex, colIndex - 1))"
        :textColor="palette.text"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserStatsRecord } from '@/types/api'
  import type { FlightSeatStatKey } from '@/types/ui'
  import SeatCell from './parts/SeatCell.vue'
  import type { CharacterColorType } from '@/types/OmikujiData/'
  import { createSeatPalette } from '../../composables/seatColors'

  const props = defineProps<{
    color: CharacterColorType
    seats: (UserStatsRecord | null)[]
    statKey: FlightSeatStatKey | null
    customLayout?: number[]
  }>()

  // 例: [3,3,3] / [1,3,5] / [4,5]
  const layout = computed(() => props.customLayout ?? [3, 3, 3])

  // 総セル数
  const total = computed(() => layout.value.reduce((sum, n) => sum + n, 0))

  // フラット配列化
  const displaySeats = computed(() => Array.from({ length: total.value }, (_, i) => props.seats[i] ?? null))

  // 行列 → インデックス変換
  const getIndex = (row: number, col: number) => layout.value.slice(0, row).reduce((sum, n) => sum + n, 0) + col

  const palette = computed(() => createSeatPalette(props.color))

  const checkerColor = (i: number): string => (i % 2 === 0 ? palette.value.even : palette.value.odd)
</script>
