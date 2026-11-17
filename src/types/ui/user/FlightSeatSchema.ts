// src/types/ui/user/FlightSeatSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../../core'
import { CharacterColorSchema } from '../../OmikujiData/assets/CharacterSchema'

/**
 * フライトシート FlightSeat(実験枠。OmikujiBotV2 から移植)
 */

// FlightSeat のコンポーネントセット
export const flightSeatComponentSets = {
  standard: ['plain', 'nineViewers', 'bingo', 'flightSeat', 'graduation', 'ferrisWheel', 'goldenCrowd'],
} as const

export type FlightSeatComponentSets = typeof flightSeatComponentSets
export type FlightSeatComponentSet = keyof FlightSeatComponentSets

// セット別の ID 型
export type FlightSeatComponentOf<S extends FlightSeatComponentSet> = FlightSeatComponentSets[S][number]

// 全 ID
export type FlightSeatComponent = FlightSeatComponentOf<FlightSeatComponentSet>

// 座席の右下に表示するステータス(UserStatsRecord のキー)
export const flightSeatStatKeys = ['userName', 'tc', 'giftPrice'] as const
export type FlightSeatStatKey = (typeof flightSeatStatKeys)[number]

/**
 * - component: 座席レイアウト(保存データは文字列。未同梱の ID も保持する)
 * - customLayout: 各行の座席数の JSON 配列文字列(例: '[3, 3, 3]')。defaultLayout が string のコンポーネントだけ使う
 * - color: 配色 (name / text / background / accent)
 * - statKey: 座席の右下に表示するステータス(null なら非表示)
 * 着席させるユーザーは、uiKey が flightSeat の投稿(BotMessage)の user から決める
 */
export const FlightSeatSchema = z.object({
  component: z.string().min(1).default('flightSeat').catch('flightSeat'),
  customLayout: z.string().optional(),
  color: normalizedObject(CharacterColorSchema, 'ui.FlightSeat.color'),
  statKey: z.enum(flightSeatStatKeys).nullable().default(null).catch(null),
})
export type FlightSeatType = z.infer<typeof FlightSeatSchema>
