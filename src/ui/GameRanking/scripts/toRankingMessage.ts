// src/ui/GameRanking/scripts/toRankingMessage.ts
import { BotMessageExtraType, BotMessageRankingSchema, BotMessageRankingType } from '@/types/generator'
import { GameLogSchema, GameLogType } from '@/types/api'

/**
 * BotMessageExtraType → BotMessageRankingType
 *
 * 保存できない (必要な項目が足りない) メッセージは null を返す。
 * - score: lists.order (ランキングの比較用の値。lists.text は表示用の文字列なので使わない)
 * - eventKey: source.eventKey
 * - user: user.userId が空のものは対象外
 *
 * TODO(games): 各ゲームスクリプトが BotMessageRankingType を直接返すようになったら、この変換は不要になる。
 *   (src/games の各 execute.ts と RankingMessage.ts に TODO を入れてある)
 */
export const toRankingMessage = (extra: BotMessageExtraType): BotMessageRankingType | null => {
  const parsed = BotMessageRankingSchema.safeParse({
    id: extra.id,
    timestamp: extra.timestamp,
    eventKey: extra.source?.eventKey,
    user: extra.user,
    score: extra.lists?.order,
  })
  return parsed.success ? parsed.data : null
}

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
