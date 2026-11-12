// packages/2026-Q4/HondaJanken/editor.ts
import EditorApp from '@/editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import { registerCommentBubble } from '@packages/_shared/commentBubble'
import { registerCommentBubbleEditor } from '@packages/_shared/commentBubbleEditor'
import '@assets/styles/DaisyUi.css'

registerCommentBubble()
registerCommentBubbleEditor()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountEditor = () => {
  createAppNotOneSDK(EditorApp)
}
