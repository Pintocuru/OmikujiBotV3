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
] as const

/**
 * 廃止した値(保存データの gift に残っていても、読み込み時に取り除く)
 * - special は金額なしのギフト用だったが、判定が届かなかったため廃止(種類は giftKinds で指定する)
 */
export const removedGiftConditions = ['special'] as const

/**
 * ギフトの種類(実際にお金が入るかで分ける)
 * - paid: 有料(金額あり) / free: 無料 / member: メンバー・サブスク(金額は 0 で扱う)
 */
export const giftKinds = ['paid', 'free', 'member'] as const
export const GiftKindValueSchema = z.enum(giftKinds)
export type GiftKindType = z.infer<typeof GiftKindValueSchema>

// スキーマと型の定義
// 配列の要素用(不正な値を別の値に置き換えず、normalizedArray で除外して記録する)
export const GiftConditionValueSchema = z.enum(giftConditions)
// 単独の値用(不正な値は 'all' に戻す)
export const GiftConditionSchema = GiftConditionValueSchema.default('all').catch('all')
export type GiftConditionType = z.infer<typeof GiftConditionSchema>
