// packages/2026-Q4/LifeHourglass/editor.ts
import EditorApp from '@/editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import '@assets/styles/DaisyUi.css'

// * エディターが必要になったら作成する

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountEditor = () => {
  createAppNotOneSDK(EditorApp)
}
