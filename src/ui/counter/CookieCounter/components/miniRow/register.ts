// src/ui/counter/CookieCounter/components/miniRow/register.ts
import type { CookieComponentOf } from '@/types/ui'
import { registerCookieCounterComponents, type CookieCounterComponent } from '../../CookieCounterRegistry'

const miniRowComponents = {
  miniRow: {
    labelKey: 'uiComponents.cookieCounter.miniRow.label',
    maxCounters: 8,
    isColor: true,
    maxCharacters: 0,
    loader: () => import('./MiniRow.vue'),
  },
} satisfies Record<CookieComponentOf<'miniRow'>, CookieCounterComponent>

export const registerMiniRowCookieComponents = () =>
  registerCookieCounterComponents({ miniRow: miniRowComponents })
