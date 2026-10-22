// src/generator/main.ts
// ! これは使用していない
import App from './App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import { registerLayout, registerUi } from '@/ui/uiRegistry'
import { registerAllGameScripts } from '@/registerRuntime'

// このパッケージで使うUIだけ書く
registerUi({
  commentBubble: () => import('@/ui/CommentBubble/CommentBubble.vue'),
})

// このパッケージで使うレイアウトだけ書く
registerLayout({
  commentBubble: () => import('@/layout/CommentBubble/CommentBubble.vue'),
})

// gameScript(データ側で選ばれるため、全種類を登録。型付きの一覧は registerRuntime.ts に1か所だけ)
registerAllGameScripts()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
