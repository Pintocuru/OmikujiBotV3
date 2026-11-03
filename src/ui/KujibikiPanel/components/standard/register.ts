// src/ui/KujibikiPanel/components/standard/register.ts
import { KUJIBIKI_PANEL_DEFAULT_COMPONENT, type KujibikiComponent } from '@/types/ui'
import { registerKujibikiPanelComponents, type KujibikiPanelComponent } from '../../KujibikiPanelRegistry'

const standardComponents = {
  omikuji: { label: 'おみくじ', isVisual: false, loader: () => import('./Omikuji.vue') },
  flower: { label: 'フラワー占い', isVisual: false, loader: () => import('./Flower.vue') },
} satisfies Record<Extract<KujibikiComponent, 'omikuji' | 'flower'>, KujibikiPanelComponent>

// コンパイル時に既定 ID が standard セットへ登録されていることを保証
const defaultComponent: keyof typeof standardComponents = KUJIBIKI_PANEL_DEFAULT_COMPONENT
void defaultComponent

export const registerStandardKujibikiComponents = () =>
  registerKujibikiPanelComponents({ standard: standardComponents })
