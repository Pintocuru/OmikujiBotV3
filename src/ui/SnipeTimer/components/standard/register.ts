// src/ui/SnipeTimer/components/standard/register.ts
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
} satisfies Record<SnipeTimerComponentOf<'standard'>, SnipeTimerUiComponent>

export const registerStandardSnipeTimerComponents = () => registerSnipeTimerComponents({ standard: standardComponents })
