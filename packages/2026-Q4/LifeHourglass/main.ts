// packages/2026-Q4/LifeHourglass/main.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import '@assets/styles/DaisyUiObs.css'
import { definePackage } from '@/register/definePackage'
import { registerStandardLifeHourglassComponents } from '@/ui/LifeHourglass/components/standard/register'

definePackage({
  kind: 'lifeHourglass',
  layout: 'lifeHourglass',
  loader: () => import('@/layout/2026-Q4/LifeHourglass/LifeHourglass.vue'),
  registerComponents: registerStandardLifeHourglassComponents,
  // editor: () => import('@/ui/LifeHourglass/editor/LifeHourglassEditor.vue'),
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
