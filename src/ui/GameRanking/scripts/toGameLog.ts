// src/ui/GameRanking/scripts/toGameLog.ts
import { BotMessageRankingType } from '@/types/generator'
import { GameLogSchema, GameLogType } from '@/types/api'

/**
 * BotMessageRankingType → GameLogType (API で保存する形)
 * - userName: 閲覧用の表示名 (listName があればそれ、なければ user.userName)
 * - item: 表示用の得点 label (空なら入れない)
 * - flag はランキングでは使わないため、入れない。
 */
export const toGameLog = (message: BotMessageRankingType): GameLogType => {
  const createdAt = Date.parse(message.timestamp)
  return GameLogSchema.parse({
    id: message.id,
    userId: message.user.userId,
    userName: message.listName || message.user.userName,
    score: message.score,
    ...(message.label ? { item: message.label } : {}),
    ...(Number.isNaN(createdAt) ? {} : { createdAt }),
  })
}
