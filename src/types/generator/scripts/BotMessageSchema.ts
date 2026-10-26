// src/types/generator/scripts/BotMessageSchema.ts
import { z } from 'zod'
import { UserNameSchema } from '@/types/OmikenComment'
import { DaisyUIColorSchema } from '@/types/core'
import { UiKindSchema } from '@/types/OmikujiData'
import { BotMessageBaseSchema } from './BotMessageBaseSchema'

/**
 * ExtraListsSchema
 * 評価ブロック {{ }} の解析結果(engine 内部用)。BotMessage には載らない。
 * TODO:廃止。BotMessageSlotsSchema (slotN) に役割を託す(評価ブロックの書き方が変わるため別作業)。
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
 * BotMessageSlotsSchema
 * 汎用スロット。slotN が何を意味するかは uiKey ごとの map (BotMessageSlotMap.ts) で決める。
 * UI が受け取る時に、用途別の型 (BotMessageRankingSchema など) へコンバートする。
 */
const SlotValueSchema = z.union([z.string(), z.number(), z.boolean()])
export const BotMessageSlotsSchema = z.object({
  slot0: SlotValueSchema.optional(),
  slot1: SlotValueSchema.optional(),
  slot2: SlotValueSchema.optional(),
  slot3: SlotValueSchema.optional(),
  slot4: SlotValueSchema.optional(),
  slot5: SlotValueSchema.optional(),
  slot6: SlotValueSchema.optional(),
  slot7: SlotValueSchema.optional(),
  slot8: SlotValueSchema.optional(),
  slot9: SlotValueSchema.optional(),
})
export type BotMessageSlotsType = z.infer<typeof BotMessageSlotsSchema>

/**
 * BotBubbleSchema
 */
const BotBubbleSchema = z.object({
  name: z.string().nullable().default(null),
  message: z.string(),
  characterKey: z.string().nullable().default(null),
  iconKey: z.string().default('default').catch('default'),
  displaySeconds: z.number().min(0).max(60).nullable().optional(),
})

/**
 * BotMessageSchema(唯一のメッセージ型)
 * - uiKey: editor が投稿フォームを選ぶ / どの UI が受け取るかを決める (必須)
 * - bubble も slots も無い = 旧 empty (処理済みの目印)
 */
export const BotMessageSchema = BotMessageBaseSchema.extend({
  uiKey: UiKindSchema,
  user: UserNameSchema.optional(),
  bubble: BotBubbleSchema.optional(),
  slots: BotMessageSlotsSchema.optional(),
})
export type BotMessageType = z.infer<typeof BotMessageSchema>

/**
 * BotMessageBubbleSchema
 * commentBubble の UI が受け取る時の型 (bubble 必須に絞ったもの)
 */
export const BotMessageBubbleSchema = BotMessageSchema.extend({
  uiKey: z.literal('commentBubble').default('commentBubble'),
  bubble: BotBubbleSchema,
})
export type BotMessageBubbleType = z.infer<typeof BotMessageBubbleSchema>

export const isBubbleMessage = (msg: BotMessageType): msg is BotMessageBubbleType =>
  msg.uiKey === 'commentBubble' && !!msg.bubble
