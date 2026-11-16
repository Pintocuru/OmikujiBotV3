// src/ui/user/LuckyDraw/components/standard/register.ts
import type { LuckyDrawComponentOf } from '@/types/ui'
import { registerLuckyDrawComponents, type LuckyDrawUiComponent } from '../../LuckyDrawRegistry'

/**
 * LuckyDraw 標準セット
 */
const standardComponents = {
  valentineCoupling: {
    labelKey: 'uiComponents.luckyDraw.valentineCoupling.label',
    loader: () => import('./ValentineCoupling.vue'),
  },
  topStars: {
    labelKey: 'uiComponents.luckyDraw.topStars.label',
    loader: () => import('./TopStars.vue'),
  },
} satisfies Record<LuckyDrawComponentOf<'standard'>, LuckyDrawUiComponent>

export const registerStandardLuckyDrawComponents = () => registerLuckyDrawComponents({ standard: standardComponents })
