// src/ui/UserBoard/components/standard/register.ts
import type { BoardComponentOf } from '@/types/ui'
import { registerUserBoardComponents, type UserBoardComponent } from '../../UserBoardRegistry'

/**
 * UserBoard 標準セット
 */
const standardComponents = {
  ranking: {
    labelKey: 'uiComponents.userBoard.ranking.label',
    descriptionKey: 'uiComponents.userBoard.ranking.description',
    hasLimit: true,
    loader: () => import('./Ranking.vue'),
  },
  teamBar: {
    labelKey: 'uiComponents.userBoard.teamBar.label',
    descriptionKey: 'uiComponents.userBoard.teamBar.description',
    hasLimit: false,
    loader: () => import('./TeamBar.vue'),
  },
  teamScore: {
    labelKey: 'uiComponents.userBoard.teamScore.label',
    descriptionKey: 'uiComponents.userBoard.teamScore.description',
    hasLimit: false,
    loader: () => import('./TeamScore.vue'),
  },
} satisfies Record<BoardComponentOf<'standard'>, UserBoardComponent>

export const registerStandardBoardComponents = () => registerUserBoardComponents({ standard: standardComponents })
