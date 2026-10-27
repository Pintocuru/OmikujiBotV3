// src/main.ts
import App from './DevApp.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import { registerAll } from './registerAll'
import '@assets/styles/DaisyUiAll.css'

registerAll()
createAppNotOneSDK(App)
