// src/ui/CookieCounter/components/standard/register.ts
import type { CookieComponentOf } from '@/types/ui'
import { registerCookieCounterComponents, type CookieCounterComponent } from '../../CookieCounterRegistry'

/**
 * CookieCounter 標準セット
 */
const standardComponents = {
  sakura: {
    labelKey: 'uiComponents.cookieCounter.sakura.label',
    maxCounters: 2,
    isColor: false,
    maxCharacters: 2,
    loader: () => import('./Sakura.vue'),
  },
  block3d: {
    labelKey: 'uiComponents.cookieCounter.block3d.label',
    maxCounters: 2,
    isColor: true,
    maxCharacters: 0,
    loader: () => import('./Block3d.vue'),
  },
} satisfies Record<CookieComponentOf<'standard'>, CookieCounterComponent>

export const registerStandardCookieComponents = () => registerCookieCounterComponents({ standard: standardComponents })
