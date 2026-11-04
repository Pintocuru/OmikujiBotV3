// src/ui/UserBoard/components/standard/register.ts
import type { BoardComponentOf } from '@/types/ui'
import { registerUserBoardComponents, type UserBoardComponent } from '../../UserBoardRegistry'

/**
 * UserBoard 標準セット
 */
const standardComponents = {
  ranking: {
    label: '個人の得点リスト',
    description: '得点の高い順に、ユーザーを表示します',
    hasLimit: true,
    loader: () => import('./Ranking.vue'),
  },
  teamBar: {
    label: 'チームの得点(バー)',
    description: 'チーム色ごとの合計得点を、バーの長さで比べられるように表示します',
    hasLimit: false,
    loader: () => import('./TeamBar.vue'),
  },
  teamScore: {
    label: 'チームの得点(スコアボード)',
    description: 'チーム色ごとの合計得点を、大きな数字で横に並べて表示します',
    hasLimit: false,
    loader: () => import('./TeamScore.vue'),
  },
} satisfies Record<BoardComponentOf<'standard'>, UserBoardComponent>

export const registerStandardBoardComponents = () => registerUserBoardComponents({ standard: standardComponents })
