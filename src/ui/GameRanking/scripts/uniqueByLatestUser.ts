// src/ui/GameRanking/scripts/uniqueByLatestUser.ts
import { BotMessageRankingType } from '@/types/generator'

/**
 * ユーザーごとに最新のメッセージだけを残す
 */
export const uniqueByLatestUser = (messages: BotMessageRankingType[]): BotMessageRankingType[] => {
  const map = new Map<string, BotMessageRankingType>()
  for (const msg of messages) {
    const prev = map.get(msg.user.userId)
    if (!prev || msg.user.timestamp > prev.user.timestamp) map.set(msg.user.userId, msg)
  }
  return [...map.values()]
}
