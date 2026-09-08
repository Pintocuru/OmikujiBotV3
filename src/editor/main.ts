// src/editor/main.ts
import App from './App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/core.js'
import '../../assets/styles/DaisyUiAllObs.css'

window.OmikujiBot = window.OmikujiBot ?? {}

window.OmikujiBot.mountConfigMaker = () => {
  createAppNotOneSDK(App)
}
