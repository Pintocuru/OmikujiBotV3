// src/ui/KujibikiPanel/components/special/register.ts
import { registerKujibikiPanelComponents } from '../../KujibikiPanelRegistry'

export const registerSpecialKujibikiComponents = () =>
  registerKujibikiPanelComponents({
    special: {
      faceCutout: { label: '顔ハメ看板', isVisual: true, loader: () => import('./FaceCutout.vue') },
    },
  })
