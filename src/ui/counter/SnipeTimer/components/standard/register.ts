// src/ui/counter/SnipeTimer/components/standard/register.ts
import type { SnipeTimerComponentOf } from '@/types/ui'
import { registerSnipeTimerComponents, type SnipeTimerUiComponent } from '../../SnipeTimerRegistry'

/**
 * SnipeTimer 標準セット
 */
const standardComponents = {
  simpleWhite: {
    labelKey: 'uiComponents.snipeTimer.simpleWhite.label',
    loader: () => import('./SimpleWhite.vue'),
  },
  simplePink: {
    labelKey: 'uiComponents.snipeTimer.simplePink.label',
    loader: () => import('./SimplePink.vue'),
  },
  miniPill: {
    labelKey: 'uiComponents.snipeTimer.miniPill.label',
    loader: () => import('./MiniPill.vue'),
  },
  miniFlip: {
    labelKey: 'uiComponents.snipeTimer.miniFlip.label',
    loader: () => import('./MiniFlip.vue'),
  },
  miniRing: {
    labelKey: 'uiComponents.snipeTimer.miniRing.label',
    loader: () => import('./MiniRing.vue'),
  },
} satisfies Record<SnipeTimerComponentOf<'standard'>, SnipeTimerUiComponent>

export const registerStandardSnipeTimerComponents = () => registerSnipeTimerComponents({ standard: standardComponents })
