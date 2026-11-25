// src/ui/counter/StreamCounter/components/miniColumn/register.ts
import type { StreamComponentOf } from '@/types/ui'
import { registerStreamCounterComponents, type StreamCounterComponent } from '../../StreamCounterRegistry'

const miniColumnComponents = {
  miniColumn: { labelKey: 'uiComponents.streamCounter.miniColumn.label', loader: () => import('./MiniColumn.vue') },
} satisfies Record<StreamComponentOf<'miniColumn'>, StreamCounterComponent>

export const registerMiniColumnStreamComponents = () => registerStreamCounterComponents({ miniColumn: miniColumnComponents })
