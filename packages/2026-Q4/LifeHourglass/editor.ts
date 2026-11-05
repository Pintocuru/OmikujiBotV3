// packages/2026-Q4/LifeHourglass/editor.ts
import EditorApp from '@/editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import '@assets/styles/DaisyUi.css'
import { registerStandardLifeHourglassComponents } from '@/ui/LifeHourglass/components/standard/register'
import { definePackage } from '@/register/definePackage'

definePackage({
  kind: 'lifeHourglass',
  layout: 'lifeHourglass',
  loader: () => import('@/layout/2026-Q4/LifeHourglass/LifeHourglass.vue'),
  registerComponents: registerStandardLifeHourglassComponents,
  editor: () => import('@/ui/LifeHourglass/editor/LifeHourglassEditor.vue'),
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountEditor = () => {
  createAppNotOneSDK(EditorApp)
}
