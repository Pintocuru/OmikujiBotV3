// src/main.ts
import App from './DevApp.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/core'
import { registerAll } from './registerAll'
import '@assets/styles/DaisyUiDark.css'

registerAll()
createAppNotOneSDK(App)
