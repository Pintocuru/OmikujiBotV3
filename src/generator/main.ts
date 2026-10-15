// src/generator/main.ts
import App from './App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import { registerUi } from '@/ui/uiRegistry'

// このパッケージで使うUIだけ書く
registerUi({
  commentBubble: () => import('@/ui/CommentBubble/generator/CommentBubble.vue'),
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
