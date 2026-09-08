// src/types/OmikujiData/UiSchema.ts
import { z } from 'zod'

/**
 * uiKinds UI種別の定義マップ
 */
export const uiKinds = [
  'bubble',
  'flashBanner',
  'commentSpin',
  'liveClock',
  'kujibikiPanel',
  'toast',
  'ranking',
  'counter',
  'streamCounter',
  'cookieCounter',
  'winnerGroup',
  'flightSeat',
  'socialRoster',
  'deadAir',
  'GiftRanking',
] as const

// 型の導出
export const UiKindSchema = z.enum(uiKinds)
export type UiKind = z.infer<typeof UiKindSchema>
