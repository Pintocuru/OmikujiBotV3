<!-- src/ui/FlightSeat/components/standard/SeatBingo.vue -->
<template>
  <div class="flex flex-col items-center gap-2">
    <!-- ヘッダー: B I N G O -->
    <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(5, 5rem)' }">
      <div
        v-for="letter in ['B', 'I', 'N', 'G', 'O']"
        :key="letter"
        class="flex items-center justify-center h-8 rounded font-black text-xl tracking-widest"
        :style="{ background: palette.even, color: palette.text }"
      >
        {{ letter }}
      </div>
    </div>

    <!-- グリッド本体 (5×5、中央=13番目はFREE) -->
    <div class="grid gap-3" :style="{ gridTemplateColumns: 'repeat(5, 5rem)' }">
      <template v-for="i in 25" :key="i">
        <!-- 中央マス (13番目 = index 12) は FREE -->
        <div
          v-if="i === 13"
          class="relative flex items-center justify-center rounded-lg font-black text-lg"
          :style="{ width: '80px', height: '80px', background: palette.gradientTo, color: palette.onGradient }"
        >
          FREE
        </div>
        <SeatCell
          v-else
          :key="seatAt(i) ? seatAt(i)!.lastVisit : `empty-${i}`"
          :seat="seatAt(i)"
          :index="slotIndex(i)"
          :seatNumber="slotIndex(i) + 1"
          :statKey="statKey"
          :colorFrom="checkerColor(i)"
          :textColor="palette.text"
        />
      </template>
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
  }>()

  const slotIndex = (i: number) => (i < 13 ? i - 1 : i - 2)
  const seatAt = (i: number): UserStatsRecord | null => props.seats[slotIndex(i)] ?? null

  const palette = computed(() => createSeatPalette(props.color))

  /**
   * 市松模様: 行・列の偶奇で、2色を切り替え
   * i は 1〜25 (1-indexed)
   */
  const checkerColor = (i: number): string => {
    const row = Math.floor((i - 1) / 5)
    const col = (i - 1) % 5
    return (row + col) % 2 === 0 ? palette.value.even : palette.value.odd
  }
</script>
