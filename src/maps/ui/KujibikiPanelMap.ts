// src/maps/ui/KujibikiPanelMap.ts
import type { KujibikiComponent, KujibikiComponentConfig } from '@/types/ui'

/**
 * くじ引き KujibikiPanel
 */

export const kujibikiComponentMap: Record<KujibikiComponent, KujibikiComponentConfig> = {
  omikuji: {
    label: 'おみくじ',
    isVisual: false,
  },
  flower: {
    label: 'フラワー占い',
    isVisual: false,
  },
  tarot: {
    label: 'タロット',
    isVisual: false,
  },
  faceCutout: {
    label: '顔ハメ看板',
    isVisual: true,
  },
}
