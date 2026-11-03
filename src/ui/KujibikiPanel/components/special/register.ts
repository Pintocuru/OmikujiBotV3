// src/ui/KujibikiPanel/components/special/register.ts
import type { KujibikiComponentOf } from '@/types/ui'
import { registerKujibikiPanelComponents, type KujibikiPanelComponent } from '../../KujibikiPanelRegistry'

/**
 * KujibikiPanel 特殊セット
 */
const specialComponents = {
  faceCutout: { label: '顔ハメ看板', isVisual: true, loader: () => import('./FaceCutout.vue') },
} satisfies Record<KujibikiComponentOf<'special'>, KujibikiPanelComponent>

export const registerSpecialKujibikiComponents = () => registerKujibikiPanelComponents({ special: specialComponents })
