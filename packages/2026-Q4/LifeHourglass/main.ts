// packages/2026-Q4/LifeHourglass/main.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import '@assets/styles/DaisyUiObs.css'
import { registerLayout } from '@/ui/uiRegistry'
import { registerStandardLifeHourglassComponents } from '@/ui/LifeHourglass/components/standard/register'
import { registerUiEditor } from '@/editor/ui/uiEditorRegistry'

// レイアウト
registerLayout({
  lifeHourglass: () => import('@/layout/2026-Q4/LifeHourglass/LifeHourglass.vue'),
})

// UI
registerStandardLifeHourglassComponents()

// UIエディタ
registerUiEditor({
  lifeHourglass: () => import('@/ui/LifeHourglass/editor/LifeHourglassEditor.vue'),
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
