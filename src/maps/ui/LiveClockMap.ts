// src/maps/ui/LiveClockMap.ts
import type { ClockComponent, ClockComponentConfig } from '@/types/ui'

/**
 * ライブクロック LiveClock
 */

export const clockComponentMap: Record<ClockComponent, ClockComponentConfig> = {
  morning: {
    label: 'モーニング',
    isColor: true,
  },
  soundPlayer: {
    label: 'サウンドプレイヤー',
    isColor: true,
  },
  clearGlass: {
    label: 'クリアガラス',
    isColor: true,
  },
  steampunk: {
    label: 'スチーム',
    isColor: true,
  },
  disco: {
    label: 'ディスコ',
    isColor: false,
  },
}
