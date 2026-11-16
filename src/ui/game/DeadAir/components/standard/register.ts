// src/ui/game/DeadAir/components/standard/register.ts
import type { DeadAirComponentOf } from '@/types/ui'
import { registerDeadAirComponents, type DeadAirUiComponent } from '../../DeadAirRegistry'

/**
 * DeadAir 標準セット
 */
const standardComponents = {
  bomb: { labelKey: 'uiComponents.deadAir.bomb.label', loader: () => import('./DeadAirBomb.vue') },
} satisfies Record<DeadAirComponentOf<'standard'>, DeadAirUiComponent>

export const registerStandardDeadAirComponents = () => registerDeadAirComponents({ standard: standardComponents })
