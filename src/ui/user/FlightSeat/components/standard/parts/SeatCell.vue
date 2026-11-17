<!-- src/ui/user/FlightSeat/components/standard/parts/SeatCell.vue -->
<template>
  <!-- ユーザーが座っている場合 -->
  <div v-if="seat" class="relative flex items-center justify-center seat-pop">
    <div class="avatar">
      <div
        class="overflow-hidden rounded-full"
        :class="seat.isSyoken ? 'ring-3 ring-warning ring-offset-6' : ''"
        :style="{
          width: cellSize + 'px',
          height: cellSize + 'px',
          borderWidth: seat.team ? '3px' : undefined,
          borderColor: seat.team ? `var(--color-${seat.team})` : undefined,
          '--tw-ring-offset-color': 'var(--seat-bg, transparent)',
        }"
      >
        <img v-if="seat.profileImage" :src="seat.profileImage" :alt="seat.userName" />
        <img v-else :src="getAvatarUrl(seat.userName)" :alt="seat.userName" class="w-full h-full object-cover" />
      </div>
    </div>

    <!-- tc (個人コメント数) -->
    <div
      v-if="statKey && statClassMap[statKey] && seat[statKey]"
      class="absolute bottom-0 right-0 text-white font-bold truncate max-w-20 seat-text-stroke"
      :class="statClassMap[statKey]"
    >
      {{ seat[statKey] }}
    </div>
  </div>

  <!-- 空席の場合 -->
  <div v-else class="rounded-lg flex items-center justify-center transition-all duration-300" :style="seatStyle">
    <div
      class="relative flex items-center justify-center text-3xl font-bold"
      :style="{ width: cellSize + 'px', height: cellSize + 'px' }"
    >
      <!-- 表示番号: 呼び出し元から seatNumber を受け取る。未指定時は index + 1 -->
      {{ seatNumber ?? index + 1 }}
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserStatsRecord } from '@/types/api'
  import type { FlightSeatStatKey } from '@/types/ui'
  import { getAvatarUrl } from '@/common/DiceBear/getAvatarUrl'

  const props = defineProps<{
    seat: UserStatsRecord | null
    index: number
    statKey: FlightSeatStatKey | null
    size?: number
    colorReverse?: boolean
    colorFrom?: string // 空席セルのベースカラー(CSS の色)
    colorTo?: string // 指定するとグラデーションになる(CSS の色)
    textColor?: string // 空席セルの番号の文字色(CSS の色)
    seatNumber?: number
    opacity?: boolean
  }>()

  const cellSize = computed(() => props.size ?? 80)

  // ---- カラー計算 -------------------------------------------------------

  /**
   * 空席セルのスタイル。
   * - colorTo があるときは colorFrom → colorTo のグラデーション
   * - colorReverse のときは、背景と文字の色を入れ替える(単色のときだけ)
   */
  const seatStyle = computed(() => {
    const from = props.colorFrom ?? 'transparent'
    const text = props.textColor ?? 'inherit'
    if (props.colorTo) {
      return { background: `linear-gradient(135deg, ${from}, ${props.colorTo})`, color: text }
    }
    const base = props.colorReverse ? { background: text, color: from } : { background: from, color: text }
    return props.opacity ? { ...base, opacity: 0.7 } : base
  })

  // ---- stat 表示 --------------------------------------------------------

  const statClassMap: Record<FlightSeatStatKey, string> = {
    userName: 'text-xs',
    tc: 'text-2xl',
    giftPrice: 'text-2xl',
  }
</script>

<style scoped>
  .seat-text-stroke {
    color: white;
    text-shadow:
      -1px -1px 0 #000,
      1px -1px 0 #000,
      -1px 1px 0 #000,
      1px 1px 0 #000;
  }

  @keyframes seat-pop {
    0% {
      transform: scale(0.5);
    }
    40% {
      transform: scale(1.3);
    }
    70% {
      transform: scale(0.9);
    }
    100% {
      transform: scale(1);
    }
  }

  .seat-pop {
    animation: seat-pop 0.45s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
</style>
