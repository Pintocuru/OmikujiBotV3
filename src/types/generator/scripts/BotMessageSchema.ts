// src/types/generator/scripts/BotMessageSchema.ts
import { z } from 'zod'
import { UserNameSchema } from '@/types/OmikenComment'
import { DaisyUIColorSchema } from '@/types/core'
import { BotMessageBaseSchema } from './BotMessageBaseSchema'
import { BotMessageRankingSchema } from './BotMessageRankingSchema'

/**
 * ExtraMessageSchema
 * TODO:廃止。ExtraSlotsSchema に役割を託す。
 */
export const ExtraListsSchema = z.object({
  listName: z.string().optional(), // 名前
  symbol: z.string().optional(), // 名前の隣につけるやつ
  text: z.string().default(''), // 表示用得点
  order: z.number().optional(), // 比較用
  variant: DaisyUIColorSchema.optional(), // 得点表示のカラー
  tags: z.array(z.string()).optional(),
  flag: z.boolean().optional(),
})
export type ExtraListsType = z.infer<typeof ExtraListsSchema>

/**
 * TODO:string/number/boolean のunionにし、汎用的にする。
 * どこかのタイミングでコンバータをかまして、
 * BotMessageRankingSchema のような型定義に変換させる。
 * あと、名前も変える。 BotMessageSlotsSchema とか。
 */
export const ExtraSlotsSchema = z.object({
  slot0: z.string().optional(),
  slot1: z.string().optional(),
  slot2: z.string().optional(),
  slot3: z.string().optional(),
  slot4: z.string().optional(),
  slot5: z.string().optional(),
  slot6: z.string().optional(),
  slot7: z.string().optional(),
  slot8: z.string().optional(),
  slot9: z.string().optional(),
})
export type ExtraSlotsType = z.infer<typeof ExtraSlotsSchema>

/**
 * BotBubbleSchema
 * TODO:廃止(GameScriptで作成するので)
 */
const BotBubbleSchema = z.object({
  name: z.string().nullable().default(null),
  message: z.string(),
  characterKey: z.string().nullable().default(null),
  iconKey: z.string().default('default').catch('default'),
  displaySeconds: z.number().min(0).max(60).nullable().optional(),
})

/**
 * BotMessageBubbleSchema
 * TODO:これを BotMessageSchema とする。
 * user プロパティを追加。
 */
export const BotMessageBubbleSchema = BotMessageBaseSchema.extend({
  type: z.literal('comment').default('comment'),
  bubble: BotBubbleSchema,
  slots: ExtraSlotsSchema.optional(),
})
export type BotMessageBubbleType = z.infer<typeof BotMessageBubbleSchema>

/**
 * BotMessageExtraSchema
 * TODO:廃止。BotMessageBubbleSchema に統合する。
 */
export const BotMessageExtraSchema = BotMessageBaseSchema.extend({
  type: z.literal('extra').default('extra'),
  user: UserNameSchema.optional(),
  lists: ExtraListsSchema.optional(),
  slots: ExtraSlotsSchema.optional(),
})
export type BotMessageExtraType = z.infer<typeof BotMessageExtraSchema>

/**
 * BotMessageEmptySchema
 * 評価ブロック等、BotMessage が生成されない場合に使用
 * TODO:これを使うのは不自然ではないか？
 */
export const BotMessageEmptySchema = BotMessageBaseSchema.extend({
  type: z.literal('empty').default('empty'),
})
export type BotMessageEmptyType = z.infer<typeof BotMessageEmptySchema>

// TODO:廃止。ユニオンではなくなる。
const _BotMessageSchema = z.discriminatedUnion('type', [
  BotMessageBubbleSchema,
  BotMessageExtraSchema,
  BotMessageRankingSchema,
  BotMessageEmptySchema,
])
export type BotMessageType = z.infer<typeof _BotMessageSchema>

/**

TODO:コンバート例。

export const toBotMessageRanking = (
  base: BotMessageBaseType,
  user: BotMessageRankingType['user'],
  slots: ExtraSlotsType,
): BotMessageRankingType => {
  return BotMessageRankingSchema.parse({
    ...base,
   hoge:{ 
    type: 'ranking',
    user,
    listName: slots.slot0 ?? '',
    symbol: slots.slot1 ?? '',
    label: slots.slot2 ?? '',
    score: Number(slots.slot3),
   }
  })
}


 */
