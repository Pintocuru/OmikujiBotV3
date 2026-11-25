// src/ui/counter/CookieCounter/components/miniColumn/register.ts
import type { CookieComponentOf } from '@/types/ui'
import { registerCookieCounterComponents, type CookieCounterComponent } from '../../CookieCounterRegistry'

const miniColumnComponents = {
  miniColumn: {
    labelKey: 'uiComponents.cookieCounter.miniColumn.label',
    maxCounters: 8,
    isColor: true,
    maxCharacters: 0,
    loader: () => import('./MiniColumn.vue'),
  },
} satisfies Record<CookieComponentOf<'miniColumn'>, CookieCounterComponent>

export const registerMiniColumnCookieComponents = () =>
  registerCookieCounterComponents({ miniColumn: miniColumnComponents })
