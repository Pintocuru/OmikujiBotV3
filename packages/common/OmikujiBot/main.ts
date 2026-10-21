// packages/common/OmikujiBot/main.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import { registerAll } from '@/registerAll'
import '@assets/styles/DaisyUiAll.css'

registerAll()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
