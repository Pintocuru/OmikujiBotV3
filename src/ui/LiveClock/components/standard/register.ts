// src/ui/LiveClock/components/standard/register.ts
import type { ClockComponentOf } from '@/types/ui'
import { registerLiveClockComponents, type LiveClockComponent } from '../../LiveClockRegistry'

/**
 * LiveClock 標準セット
 */
const standardComponents = {
  morning: { label: 'モーニング', isColor: true, loader: () => import('./Morning.vue') },
  soundPlayer: { label: 'サウンドプレイヤー', isColor: true, loader: () => import('./SoundPlayer.vue') },
  clearGlass: { label: 'クリアガラス', isColor: true, loader: () => import('./ClearGlass.vue') },
  steampunk: { label: 'スチーム', isColor: true, loader: () => import('./Steampunk.vue') },
  disco: { label: 'ディスコ', isColor: false, loader: () => import('./Disco.vue') },
} satisfies Record<ClockComponentOf<'standard'>, LiveClockComponent>

export const registerStandardClockComponents = () => registerLiveClockComponents({ standard: standardComponents })
