// src/maps/ui/CookieCounterMap.ts
import type { CookieComponent, CookieComponentConfig } from '@/types/ui'

/**
 * クッキーカウンター CookieCounter
 */

export const cookieComponentMap: Record<CookieComponent, CookieComponentConfig> = {
  sakura: {
    label: 'さくらツイン🌸',
    maxCounters: 2,
    isColor: false,
    hasImage: true,
  },
  block3d: {
    label: 'ブロックツイン',
    maxCounters: 2,
    isColor: true,
    hasImage: false,
  },
}
