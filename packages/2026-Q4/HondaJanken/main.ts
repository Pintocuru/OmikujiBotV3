// packages/2026-Q4/HondaJanken/main.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import { registerCommentBubble } from '@packages/_shared/commentBubble'
import '@assets/styles/DaisyUiObs.css'

registerCommentBubble()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
