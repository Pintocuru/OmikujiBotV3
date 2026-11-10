// src/ui/KujibikiPanel/components/standard/register.ts
import type { KujibikiComponentOf } from '@/types/ui'
import { registerKujibikiPanelComponents, type KujibikiPanelComponent } from '../../KujibikiPanelRegistry'

/**
 * KujibikiPanel 標準セット
 */
const standardComponents = {
  omikuji: {
    labelKey: 'uiComponents.kujibikiPanel.omikuji.label',
    isVisual: false,
    loader: () => import('./Omikuji.vue'),
  },
  flower: {
    labelKey: 'uiComponents.kujibikiPanel.flower.label',
    isVisual: false,
    loader: () => import('./Flower.vue'),
  },
} satisfies Record<KujibikiComponentOf<'standard'>, KujibikiPanelComponent>

export const registerStandardKujibikiComponents = () =>
  registerKujibikiPanelComponents({ standard: standardComponents })
