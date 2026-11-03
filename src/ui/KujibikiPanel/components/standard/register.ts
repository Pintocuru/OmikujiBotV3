// src/ui/KujibikiPanel/components/standard/register.ts
import { registerKujibikiPanelComponents } from '../../KujibikiPanelRegistry'

export const registerStandardKujibikiComponents = () =>
  registerKujibikiPanelComponents({
    standard: {
      omikuji: { label: 'おみくじ', isVisual: false, loader: () => import('./Omikuji.vue') },
      flower: { label: 'フラワー占い', isVisual: false, loader: () => import('./Flower.vue') },
    },
  })
