// src/ui/user/FlightSeat/composables/useFlightSeatBoarding.ts
import { onUnmounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/generator/stores/useAppStore'
import type { UserNameType } from '@/types/OmikenComment'

/**
 * 配信画面用: flightSeat 宛ての BotMessage の user を、座席に着席させる
 * 本文は使わないため、useFilteredBotMessages ではなく botMessages を直接見る
 */
export const useFlightSeatBoarding = (registerUser: (user: UserNameType) => boolean) => {
  const { botMessages } = storeToRefs(useAppStore())
  const processed = new Set<string>()

  const stopWatch = watch(
    botMessages,
    (list) => {
      for (const msg of list) {
        if (msg.uiKey !== 'flightSeat' || processed.has(msg.id)) continue
        processed.add(msg.id)
        if (msg.user?.userId) registerUser(msg.user)
      }
    },
    { immediate: true }
  )
  onUnmounted(stopWatch)
}
