// src/main.ts
import App from './DevApp.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/core'
import { registerAll } from './registerAll'

registerAll()
createAppNotOneSDK(App)
