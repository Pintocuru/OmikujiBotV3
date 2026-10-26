// src/types/generator/scripts/BotMessageRankingSchema.ts
import { UserNameSchema } from '@/types/OmikenComment'
import { z } from 'zod'
import { BotMessageBaseSchema } from './BotMessageBaseSchema'

/**
 * BotMessageRankingSchema
 * TODO:これは、どこへ置くのが適切か？
 * generator editor の両方で使うので、適切な場所を募集。
 *
 * - eventKey(どのイベントの記録か)は、他のメッセージと同じく source.eventKey に入る。
 * - 表示するかどうか(上限・ユーザーごとの重複など)は、メッセージでは決めず UI 側で決める。
 */
export const BotMessageRankingSchema = BotMessageBaseSchema.extend({
  type: z.literal('ranking').default('ranking'),
  user: UserNameSchema.extend({ userId: z.string().min(1) }), // 記録した人 (userId は必須)
  listName: z.string().default(''), // 表示名 (空なら user.userName を使う)
  symbol: z.string().default(''), // 名前の補助記号
  label: z.string().default(''), // 表示用の得点 (例: '30点'、'大吉')
  score: z.number(), // 比較用の得点 (表示はしない)
})
export type BotMessageRankingType = z.infer<typeof BotMessageRankingSchema>

/**

コンバート例。
export const toBotMessageRanking = (
  base: BotMessageBaseType,
  user: BotMessageRankingType['user'],
  slots: ExtraSlotsType,
): BotMessageRankingType => {
  return BotMessageRankingSchema.parse({
    ...base,
   // ネストしないと読みづらいので。
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
