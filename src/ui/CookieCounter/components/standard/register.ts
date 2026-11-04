// src/ui/CookieCounter/components/standard/register.ts
import type { CookieComponentOf } from '@/types/ui'
import { registerCookieCounterComponents, type CookieCounterComponent } from '../../CookieCounterRegistry'

/**
 * CookieCounter 標準セット
 */
const standardComponents = {
  sakura: {
    label: 'さくらツイン🌸',
    maxCounters: 2,
    isColor: false,
    hasImage: true,
    loader: () => import('./Sakura.vue'),
  },
  block3d: {
    label: 'ブロックツイン',
    maxCounters: 2,
    isColor: true,
    hasImage: false,
    loader: () => import('./Block3d.vue'),
  },
} satisfies Record<CookieComponentOf<'standard'>, CookieCounterComponent>

export const registerStandardCookieComponents = () => registerCookieCounterComponents({ standard: standardComponents })
