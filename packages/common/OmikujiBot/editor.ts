// packages/common/OmikujiBot/editor.ts
import EditorApp from '@/editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import { registerMain, registerEditor } from './register'
import '@assets/styles/DaisyUi.css'

registerMain()
registerEditor()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountEditor = () => {
  createAppNotOneSDK(EditorApp)
}
