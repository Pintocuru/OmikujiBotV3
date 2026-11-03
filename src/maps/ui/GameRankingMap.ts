// src/maps/ui/GameRankingMap.ts
import type { RankingSortOrder } from '@/types/ui'

/**
 * ランキング GameRanking
 */

export const rankingSortOrderMap: Record<RankingSortOrder, string> = {
  new: '新着順',
  high: 'スコア高い順',
  low: 'スコア低い順',
}
