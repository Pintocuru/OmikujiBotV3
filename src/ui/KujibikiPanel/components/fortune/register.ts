// src/ui/KujibikiPanel/components/fortune/register.ts
import type { KujibikiComponent } from '@/types/ui'
import { registerKujibikiPanelComponents, type KujibikiPanelComponent } from '../../KujibikiPanelRegistry'

/**
 * KujibikiPanel 占いセット
 */
type FortuneKujibikiComponent = 'tarot'

const fortuneComponents = {
  tarot: { label: 'タロット', isVisual: false, loader: () => import('./Tarot.vue') },
} satisfies Record<Extract<KujibikiComponent, FortuneKujibikiComponent>, KujibikiPanelComponent>

export const registerFortuneKujibikiComponents = () => registerKujibikiPanelComponents({ fortune: fortuneComponents })
