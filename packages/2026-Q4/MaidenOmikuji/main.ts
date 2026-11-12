// packages/2026-Q4/MaidenOmikuji/main.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import { definePackage } from '@/register/definePackage'
import { registerStandardKujibikiComponents } from '@/ui/KujibikiPanel/components/standard/register'
import '@assets/styles/DaisyUiObs.css'

definePackage({
  kind: 'kujibikiPanel',
  layout: 'kujibikiPanel',
  loader: () => import('@/layout/common/KujibikiPanel/KujibikiPanel.vue'),
  registerComponents: registerStandardKujibikiComponents,
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
