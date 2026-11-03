// src/ui/KujibikiPanel/components/special/register.ts
import type { KujibikiComponent } from '@/types/ui'
import { registerKujibikiPanelComponents, type KujibikiPanelComponent } from '../../KujibikiPanelRegistry'

const specialComponents = {
  faceCutout: { label: '顔ハメ看板', isVisual: true, loader: () => import('./FaceCutout.vue') },
} satisfies Record<Extract<KujibikiComponent, 'faceCutout'>, KujibikiPanelComponent>

export const registerSpecialKujibikiComponents = () =>
  registerKujibikiPanelComponents({ special: specialComponents })
