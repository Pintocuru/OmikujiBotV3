// packages/2026-Q4/MaidenOmikuji/editor.ts
import EditorApp from '@/editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import { definePackage } from '@/register/definePackage'
import { registerStandardKujibikiComponents } from '@/ui/KujibikiPanel/components/standard/register'
import '@assets/styles/DaisyUi.css'

definePackage({
  kind: 'kujibikiPanel',
  layout: 'kujibikiPanel',
  loader: () => import('@/layout/common/KujibikiPanel/KujibikiPanel.vue'),
  registerComponents: registerStandardKujibikiComponents,
  editor: () => import('@/ui/KujibikiPanel/editor/KujibikiPanelEditor.vue'),
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountEditor = () => {
  createAppNotOneSDK(EditorApp)
}
