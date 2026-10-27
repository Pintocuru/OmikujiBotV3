// src/types/generator/scripts/BotMessageRankingSchema.ts
import { UserNameSchema } from '@/types/OmikenComment'
import { z } from 'zod'
import { BotMessageSchema, BotMessageSlotsType, BotMessageType } from './BotMessageSchema'
import { RankingSlotKey, RankingSlotMap } from './BotMessageSlotMap'

/**
 * ranking の値 (BotMessage.slots を RankingSlotMap でコンバートしたもの)
 * - 表示するかどうか(上限・ユーザーごとの重複など)は、メッセージでは決めず UI 側で決める。
 */
export const RankingSlotsSchema = z.object({
  gameKey: z.string().optional(), // ゲームの認識キー(任意)
  listName: z.string().default(''), // 表示名 (空なら user.userName を使う)
  symbol: z.string().default(''), // 名前の補助記号
  label: z.string().default(''), // 表示用の得点 (例: '30点'、'大吉')
  score: z.number(), // 比較用の得点 (表示はしない)
})
export type RankingSlotsType = z.infer<typeof RankingSlotsSchema>

/**
 * BotMessageRankingSchema
 * gameRanking の UI が受け取る時の型。BotMessageType ではない(slots の中身が別物)。
 */
export const BotMessageRankingSchema = BotMessageSchema.extend({
  uiKey: z.literal('gameRanking').default('gameRanking'),
  user: UserNameSchema.extend({ userId: z.string().min(1) }), // 記録した人 (userId は必須)
  slots: RankingSlotsSchema,
})
export type BotMessageRankingType = z.infer<typeof BotMessageRankingSchema>

const pick = (s: BotMessageSlotsType, k: RankingSlotKey) => s[RankingSlotMap[k].slot]

/**
 * BotMessage → ranking (UI が受け取る時のコンバート)
 * uiKey が違う / user・slots が無い / score が数値でないものは null
 */
export const toRankingEntry = (msg: BotMessageType): BotMessageRankingType | null => {
  if (msg.uiKey !== 'gameRanking' || !msg.slots || !msg.user) return null
  const s = msg.slots
  const gameKey = pick(s, 'gameKey')
  const result = BotMessageRankingSchema.safeParse({
    ...msg,
    slots: {
      gameKey: gameKey == null ? undefined : String(gameKey),
      listName: String(pick(s, 'listName') ?? ''),
      symbol: String(pick(s, 'symbol') ?? ''),
      label: String(pick(s, 'label') ?? ''),
      score: Number(pick(s, 'score')),
    },
  })
  return result.success ? result.data : null
}

/**
 * ranking → BotMessage (games が作った ranking を、汎用の slots に戻す)
 */
export const fromRankingEntry = (entry: BotMessageRankingType): BotMessageType => {
  const { slots, ...rest } = entry
  const out: BotMessageSlotsType = {}
  for (const key of Object.keys(RankingSlotMap) as RankingSlotKey[]) {
    const value = slots[key]
    if (value !== undefined) out[RankingSlotMap[key].slot] = value
  }
  return { ...rest, slots: out }
}
