// src/ui/KujibikiPanel/components/fortune/register.ts
import { registerKujibikiPanelComponents } from '../../KujibikiPanelRegistry'

export const registerFortuneKujibikiComponents = () =>
  registerKujibikiPanelComponents({
    fortune: {
      tarot: { label: 'タロット', isVisual: false, loader: () => import('./Tarot.vue') },
    },
  })
