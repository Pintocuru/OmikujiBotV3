// packages/common/StrawberryChocolate/main.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import { registerCommentBubble } from '@packages/_shared/commentBubble'

registerCommentBubble()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
