// CookieCounter mini set
import type { CookieComponentOf } from '@/types/ui'
import { registerCookieCounterComponents, type CookieCounterComponent } from '../../CookieCounterRegistry'

const miniComponents = {
  miniColumn: { labelKey: 'uiComponents.cookieCounter.miniColumn.label', maxCounters: 8, isColor: true, maxCharacters: 0, loader: () => import('../miniColumn/MiniColumn.vue') },
  miniRow: { labelKey: 'uiComponents.cookieCounter.miniRow.label', maxCounters: 8, isColor: true, maxCharacters: 0, loader: () => import('../miniRow/MiniRow.vue') },
} satisfies Record<CookieComponentOf<'mini'>, CookieCounterComponent>

export const registerMiniCookieComponents = () => registerCookieCounterComponents({ mini: miniComponents })
