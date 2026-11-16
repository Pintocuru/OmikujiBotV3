<!-- src/ui/FlightSeat/FlightSeat.vue -->
<template>
  <FlightSeatSelector
    :settings="settings"
    :seats="seats"
    :statKey="localStatKey"
    :totalSeats="totalSeats"
    :customLayout="parsedCustomLayout"
    @click="toggleStatKey"
  />
</template>

<script setup lang="ts">
  import { computed, ref, watch } from 'vue'
  import { useAppStore } from '@/generator/stores/useAppStore'
  import { FlightSeatSchema, flightSeatStatKeys, type FlightSeatStatKey } from '@/types/ui'
  import FlightSeatSelector from './FlightSeatSelector.vue'
  import { useSeatManager } from './composables/useSeatManager'
  import { useFlightSeatLayout } from './composables/useFlightSeatLayout'
  import { useFlightSeatBoarding } from './composables/useFlightSeatBoarding'

  const appStore = useAppStore()
  const settings = computed(() => FlightSeatSchema.parse(appStore.data.ui?.settings?.flightSeat ?? {}))

  // 座席数と行ごとの座席数
  const { totalSeats, parsedCustomLayout } = useFlightSeatLayout(settings)

  // 座席の管理(統計は userStats から引く)と、投稿されたユーザーの着席
  const { seats, registerUser } = useSeatManager(totalSeats, (userId) => appStore.userStats.get(userId))
  useFlightSeatBoarding(registerUser)

  // 右下のステータス(クリックで 非表示 → ユーザー名 → チャット数 → ギフト金額 の順に切り替える)
  const localStatKey = ref<FlightSeatStatKey | null>(settings.value.statKey)
  watch(
    () => settings.value.statKey,
    (v) => (localStatKey.value = v)
  )

  const toggleStatKey = () => {
    const order = [null, ...flightSeatStatKeys] as const
    localStatKey.value = order[(order.indexOf(localStatKey.value) + 1) % order.length]
  }
</script>
