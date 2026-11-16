// src/ui/FlightSeat/composables/seatColors.ts
import type { CharacterColorType } from '@/types/OmikujiData/'

/**
 * 座席の配色(設定の color から作る)
 * - even / odd: 空席の市松模様の 2 色(odd は accent を背景に溶かした色)
 * - text: 空席の番号の文字色
 * - gradientFrom / gradientTo / onGradient: 特等席・中央席のグラデーションと、その上の文字色
 */
export type SeatPalette = {
  even: string
  odd: string
  text: string
  gradientFrom: string
  gradientTo: string
  onGradient: string
}

export const createSeatPalette = (color: CharacterColorType): SeatPalette => ({
  even: color.accent,
  odd: `color-mix(in srgb, ${color.accent} 55%, ${color.background})`,
  text: color.text,
  gradientFrom: color.accent,
  gradientTo: color.text,
  onGradient: color.background,
})
