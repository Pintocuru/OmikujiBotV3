// src/packages/omikujiBot/generator.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import '../../../assets/styles/DaisyUiDarkObs.css'

window.OmikujiBot = window.OmikujiBot ?? {}

window.OmikujiBot.mountConfigMaker = () => {
  createAppOneSDK(App)
}
