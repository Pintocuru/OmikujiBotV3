// src/ui/KujibikiPanel/components/fortune/register.ts
import type { KujibikiComponentOf } from '@/types/ui'
import { registerKujibikiPanelComponents, type KujibikiPanelComponent } from '../../KujibikiPanelRegistry'

/**
 * KujibikiPanel 占いセット
 */
const fortuneComponents = {
  tarot: { labelKey: 'uiComponents.kujibikiPanel.tarot.label', isVisual: false, loader: () => import('./Tarot.vue') },
  bigBang: {
    labelKey: 'uiComponents.kujibikiPanel.bigBang.label',
    isVisual: false,
    loader: () => import('./BigBang.vue'),
  },
} satisfies Record<KujibikiComponentOf<'fortune'>, KujibikiPanelComponent>

export const registerFortuneKujibikiComponents = () => registerKujibikiPanelComponents({ fortune: fortuneComponents })
