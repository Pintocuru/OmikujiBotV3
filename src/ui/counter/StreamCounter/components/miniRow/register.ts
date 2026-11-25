// src/ui/counter/StreamCounter/components/miniRow/register.ts
import type { StreamComponentOf } from '@/types/ui'
import { registerStreamCounterComponents, type StreamCounterComponent } from '../../StreamCounterRegistry'

const miniRowComponents = {
  miniRow: { labelKey: 'uiComponents.streamCounter.miniRow.label', loader: () => import('./MiniRow.vue') },
} satisfies Record<StreamComponentOf<'miniRow'>, StreamCounterComponent>

export const registerMiniRowStreamComponents = () => registerStreamCounterComponents({ miniRow: miniRowComponents })
