// src/ui/counter/CookieCounter/components/cookie/register.ts
import type { CookieComponentOf } from '@/types/ui'
import { registerCookieCounterComponents, type CookieCounterComponent } from '../../CookieCounterRegistry'

const cookieComponents = {
  sakura: {
    labelKey: 'uiComponents.cookieCounter.sakura.label',
    maxCounters: 2,
    isColor: false,
    maxCharacters: 2,
    loader: () => import('../standard/Sakura.vue'),
  },
  block3d: {
    labelKey: 'uiComponents.cookieCounter.block3d.label',
    maxCounters: 2,
    isColor: true,
    maxCharacters: 0,
    loader: () => import('../standard/Block3d.vue'),
  },
} satisfies Record<CookieComponentOf<'cookie'>, CookieCounterComponent>

export const registerCookieComponents = () => registerCookieCounterComponents({ cookie: cookieComponents })
