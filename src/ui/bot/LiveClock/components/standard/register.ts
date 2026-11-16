// src/ui/LiveClock/components/standard/register.ts
import type { ClockComponentOf } from '@/types/ui'
import { registerLiveClockComponents, type LiveClockComponent } from '../../LiveClockRegistry'

/**
 * LiveClock 標準セット
 */
const standardComponents = {
  morning: { labelKey: 'uiComponents.liveClock.morning.label', isColor: true, loader: () => import('./Morning.vue') },
  soundPlayer: {
    labelKey: 'uiComponents.liveClock.soundPlayer.label',
    isColor: true,
    loader: () => import('./SoundPlayer.vue'),
  },
  clearGlass: {
    labelKey: 'uiComponents.liveClock.clearGlass.label',
    isColor: true,
    loader: () => import('./ClearGlass.vue'),
  },
  steampunk: {
    labelKey: 'uiComponents.liveClock.steampunk.label',
    isColor: true,
    loader: () => import('./Steampunk.vue'),
  },
  disco: { labelKey: 'uiComponents.liveClock.disco.label', isColor: false, loader: () => import('./Disco.vue') },
} satisfies Record<ClockComponentOf<'standard'>, LiveClockComponent>

export const registerStandardClockComponents = () => registerLiveClockComponents({ standard: standardComponents })
