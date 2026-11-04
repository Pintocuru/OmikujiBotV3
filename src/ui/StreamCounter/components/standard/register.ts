// src/ui/StreamCounter/components/standard/register.ts
import type { StreamComponentOf } from '@/types/ui'
import { registerStreamCounterComponents, type StreamCounterComponent } from '../../StreamCounterRegistry'

/**
 * StreamCounter 標準セット
 */
const standardComponents = {
  pixelBadge: { label: 'ピクセルバッジ', loader: () => import('./PixelBadge.vue') },
} satisfies Record<StreamComponentOf<'standard'>, StreamCounterComponent>

export const registerStandardStreamComponents = () => registerStreamCounterComponents({ standard: standardComponents })
