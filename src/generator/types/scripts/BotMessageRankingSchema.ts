// src/generator/types/scripts/BotMessageRankingSchema.ts
import { UserNameSchema } from '@/types/OmikenComment'
import { idSchema } from '@/types/core'
import { z } from 'zod'

/**
 * BotMessageRankingSchema
 * ランキング(ゲームログ)専用のメッセージ。
 * BotMessageExtraSchema は汎用で optional が多いため、ランキングに必要な項目だけを必須にした別定義。
 *
 * - 既存の BotMessageExtraSchema / _BotMessageSchema (BotMessageType) には触れていない。
 *   他の箇所が依存しているため、union にはまだ加えない。
 * - TODO(games): 各ゲームスクリプトがこの型を直接返すようにしたら、union への追加を検討する。
 *   それまでは src/ui/GameRanking/scripts/toRankingMessage.ts が BotMessageExtraType から変換する。
 */
export const BotMessageRankingSchema = z.object({
  type: z.literal('ranking').default('ranking'),
  id: idSchema,
  timestamp: z.string().default(() => new Date().toISOString()), // ISO 8601
  eventKey: z.string().min(1), // どのイベント(ゲーム)の記録か
  user: UserNameSchema.extend({ userId: z.string().min(1) }), // 記録した人 (userId は必須)
  score: z.number().finite(), // ランキング判定用のメイン数値
})
export type BotMessageRankingType = z.infer<typeof BotMessageRankingSchema>
