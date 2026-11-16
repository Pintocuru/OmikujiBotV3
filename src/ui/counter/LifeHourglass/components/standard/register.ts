// src/ui/LifeHourglass/components/standard/register.ts
import type { LifeHourglassComponentOf } from '@/types/ui'
import { registerLifeHourglassComponents, type LifeHourglassUiComponent } from '../../LifeHourglassRegistry'

/**
 * LifeHourglass 標準セット
 */
const standardComponents = {
  sandBowl: { labelKey: 'uiComponents.lifeHourglass.sandBowl.label', loader: () => import('./SandBowl.vue') },
} satisfies Record<LifeHourglassComponentOf<'standard'>, LifeHourglassUiComponent>

export const registerStandardLifeHourglassComponents = () =>
  registerLifeHourglassComponents({ standard: standardComponents })
