// src/types/engine/trigger/GiftCondition.ts
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
// 配列の要素用(不正な値を別の値に置き換えず、normalizedArray で除外して記録する)
export const GiftConditionValueSchema = z.enum(giftConditions)
// 単独の値用(不正な値は 'all' に戻す)
export const GiftConditionSchema = GiftConditionValueSchema.default('all').catch('all')
export type GiftConditionType = z.infer<typeof GiftConditionSchema>
