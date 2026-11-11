// src/maps/ui/GameRankingMap.ts
import type { RankingSortOrder } from '@/types/ui'

/**
 * ランキング GameRanking
 */
export const rankingSortOrderMap: Record<RankingSortOrder, string> = {
  new: 'uiSettings.gameRanking.sortOrder.options.new',
  high: 'uiSettings.gameRanking.sortOrder.options.high',
  low: 'uiSettings.gameRanking.sortOrder.options.low',
}
