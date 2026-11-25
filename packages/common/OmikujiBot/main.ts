// packages/common/OmikujiBot/main.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import { registerMain } from './register'
import '@assets/styles/DaisyUiObs.css'

registerMain()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
