// src/main.ts
import App from './DevApp.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/core'
import { registerAll } from './registerAll'
import '@assets/styles/DaisyUiAll.css'

registerAll()
createAppNotOneSDK(App)
