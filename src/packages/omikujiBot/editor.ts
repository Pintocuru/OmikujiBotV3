// src/packages/omikujiBot/editor.ts
import App from '@/editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/core'
import '../../../assets/styles/DaisyUiDark.css'

window.OmikujiBot = window.OmikujiBot ?? {}

window.OmikujiBot.mountConfigMaker = () => {
  createAppNotOneSDK(App)
}
