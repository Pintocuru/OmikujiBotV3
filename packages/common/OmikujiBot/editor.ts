// packages/common/OmikujiBot/editor.ts
import EditorApp from '@/editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import { registerAll } from '@/registerAll'
import '@assets/styles/DaisyUiAll.css'

registerAll()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountEditor = () => {
  createAppNotOneSDK(EditorApp)
}
