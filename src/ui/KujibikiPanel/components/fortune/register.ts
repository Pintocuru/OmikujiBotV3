// src/ui/KujibikiPanel/components/fortune/register.ts
import type { KujibikiComponent } from '@/types/ui'
import { registerKujibikiPanelComponents, type KujibikiPanelComponent } from '../../KujibikiPanelRegistry'

const fortuneComponents = {
  tarot: { label: 'タロット', isVisual: false, loader: () => import('./Tarot.vue') },
} satisfies Record<Extract<KujibikiComponent, 'tarot'>, KujibikiPanelComponent>

export const registerFortuneKujibikiComponents = () =>
  registerKujibikiPanelComponents({ fortune: fortuneComponents })
