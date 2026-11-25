// src/ui/counter/CookieCounter/components/standard/register.ts
import type { CookieComponentOf } from '@/types/ui'
import { registerCookieCounterComponents, type CookieCounterComponent } from '../../CookieCounterRegistry'

/**
 * CookieCounter 標準セット
 */
const standardComponents = {
  pixelBadge: {
    labelKey: 'uiComponents.cookieCounter.pixelBadge.label',
    maxCounters: 8,
    isColor: true,
    maxCharacters: 0,
    loader: () => import('./PixelBadge.vue'),
  },
} satisfies Record<CookieComponentOf<'standard'>, CookieCounterComponent>

export const registerStandardCookieComponents = () => registerCookieCounterComponents({ standard: standardComponents })
