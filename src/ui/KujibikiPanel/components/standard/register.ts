// src/ui/KujibikiPanel/components/standard/register.ts
import type { KujibikiComponent, kujibikiComponentSets } from '@/types/ui'
import { registerKujibikiPanelComponents, type KujibikiPanelComponent } from '../../KujibikiPanelRegistry'

/**
 * KujibikiPanel 標準セット
 */
type StandardComponent = Extract<KujibikiComponent, (typeof kujibikiComponentSets)['standard'][number]>

const standardComponents = {
  omikuji: { label: 'おみくじ', isVisual: false, loader: () => import('./Omikuji.vue') },
  flower: { label: 'フラワー占い', isVisual: false, loader: () => import('./Flower.vue') },
} satisfies Record<Extract<KujibikiComponent, StandardComponent>, KujibikiPanelComponent>

export const registerStandardKujibikiComponents = () =>
  registerKujibikiPanelComponents({ standard: standardComponents })
