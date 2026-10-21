// packages/common/StrawberryChocolate/editor.ts
// 有料版のエディター用アクセスポイント。ジェネレーター(main.ts)と同じ UI の絞り方をする
import EditorApp from '@/editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import { registerCommentBubble } from '@packages/_shared/commentBubble'
import { registerCommentBubbleEditor } from '@packages/_shared/commentBubbleEditor'
import '@assets/styles/DaisyUiAll.css'

// プレビュー用の UI と、UI の設定画面を登録 (main.ts と同じ UI 構成)
registerCommentBubble()
registerCommentBubbleEditor()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountEditor = () => {
  createAppNotOneSDK(EditorApp)
}
