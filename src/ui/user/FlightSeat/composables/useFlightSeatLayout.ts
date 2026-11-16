// src/ui/FlightSeat/composables/useFlightSeatLayout.ts
import { computed, type Ref } from 'vue'
import type { FlightSeatType } from '@/types/ui'
import { getFlightSeatComponent } from '../FlightSeatRegistry'
import { calculateTotalSeats, parseCustomLayout } from './seatLayoutUtils'

/**
 * 座席数と行ごとの座席数を、設定から決める
 * - 登録された defaultLayout が唯一の定義元。customLayout があれば上書き(string の defaultLayout のときだけ)
 * - 未登録のコンポーネントのときは 0 席
 */
export const useFlightSeatLayout = (settings: Ref<FlightSeatType>) => {
  const definition = computed(() => getFlightSeatComponent(settings.value.component))
  const defaultLayout = computed(() => definition.value?.defaultLayout ?? 0)

  // 総座席数
  const totalSeats = computed(() => calculateTotalSeats(defaultLayout.value, settings.value.customLayout))

  // string 型の defaultLayout または customLayout を、行ごとの座席数の配列にしたもの
  const parsedCustomLayout = computed(() => parseCustomLayout(defaultLayout.value, settings.value.customLayout))

  return { definition, defaultLayout, totalSeats, parsedCustomLayout }
}
