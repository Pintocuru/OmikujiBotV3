// src/ui/GameRanking/components/standard/register.ts
import type { RankingComponentOf } from '@/types/ui'
import { registerGameRankingComponents, type GameRankingComponent } from '../../GameRankingRegistry'

/**
 * GameRanking 標準セット
 */
const standardComponents = {
  standard: { label: 'スタンダード', loader: () => import('./Standard.vue') },
  suikaGame: { label: 'スイカゲーム風ランキング', loader: () => import('./SuikaGame.vue') },
} satisfies Record<RankingComponentOf<'standard'>, GameRankingComponent>

export const registerStandardRankingComponents = () => registerGameRankingComponents({ standard: standardComponents })
