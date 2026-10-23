<!-- src/ui/UserBoard/layouts/SeatBoard.vue -->
<!-- 席順 (席順の小さい順) -->
<template>
  <div v-if="seats.length > 0" class="grid grid-cols-2 gap-1.5 rounded-2xl p-2 shadow-xl" :style="boardRootStyle(settings)">
    <div
      v-for="seat in seats"
      :key="seat.user.userId"
      class="flex min-w-0 items-center gap-1.5 rounded-lg p-1 pl-2"
      :style="{
        backgroundColor: mix('var(--rk-accent)', 20),
        borderLeft: `6px solid ${seat.user.team ? teamColor(seat.user.team) : 'transparent'}`,
      }"
    >
      <!-- 席番号 -->
      <div
        class="inline-flex h-6 min-w-6 shrink-0 items-center justify-center rounded-lg px-1.5 text-sm font-bold"
        :style="{ backgroundColor: 'var(--rk-accent)', color: 'var(--rk-bg)' }"
      >
        {{ seat.order }}
      </div>
      <UserAvatar :user="seat.user" :size="24" />
      <span class="min-w-0 grow truncate font-bold" :style="{ color: 'var(--rk-name)' }">{{ seat.user.userName }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import type { UserStatsRecord } from '@/types/api'
  import type { UserBoardType } from '@/types/ui'
  import { buildSeats } from '../scripts/boardData'
  import { boardRootStyle, mix, teamColor } from './boardStyle'
  import UserAvatar from './UserAvatar.vue'

  const props = defineProps<{ users: UserStatsRecord[]; settings: UserBoardType }>()

  const seats = computed(() => buildSeats(props.users, props.settings.limit))
</script>
