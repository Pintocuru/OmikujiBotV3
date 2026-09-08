// shared/types/Threshold/GiftCondition.ts
import { z } from 'zod'

/**
 * ギフト条件の種類
 */
export const giftConditions = [
  'all',
  'blue',
  'lightBlue',
  'green',
  'yellow',
  'orange',
  'pink',
  'red',
  'purple',
  'special',
] as const

// スキーマと型の定義
export const GiftConditionSchema = z.enum(giftConditions).default('all').catch('all')
export type GiftCondition = z.infer<typeof GiftConditionSchema>
