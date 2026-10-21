// src/maps/ui/GameRankingMap.ts
import type { RankingComponent, RankingSortOrder } from '@/types/ui'

/**
 * ランキング GameRanking
 */

export const rankingComponentMap: Record<RankingComponent, { label: string }> = {
  standard: {
    label: 'スタンダード',
  },
  suikaGame: {
    label: 'スイカゲーム風ランキング',
  },
}

export const rankingSortOrderMap: Record<RankingSortOrder, string> = {
  new: '新着順',
  high: 'スコア高い順',
  low: 'スコア低い順',
}
