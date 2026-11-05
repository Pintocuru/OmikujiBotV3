// packages/common/OmikujiBot/main.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import { registerAll } from '@/register/registerAll'
import '@assets/styles/DaisyUiObs.css'

registerAll()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
