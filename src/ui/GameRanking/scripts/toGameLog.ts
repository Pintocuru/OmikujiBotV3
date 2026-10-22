// src/ui/GameRanking/scripts/toGameLog.ts
import { BotMessageRankingType } from '@/types/generator'
import { GameLogSchema, GameLogType } from '@/types/api'

/**
 * BotMessageRankingType → GameLogType (API で保存する形)
 * item / flag はランキングでは使わないため、入れない。
 */
export const toGameLog = (message: BotMessageRankingType): GameLogType => {
  const createdAt = Date.parse(message.timestamp)
  return GameLogSchema.parse({
    id: message.id,
    userId: message.user.userId,
    score: message.score,
    ...(Number.isNaN(createdAt) ? {} : { createdAt }),
  })
}
