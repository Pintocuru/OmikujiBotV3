// src/console/main.ts
// LiveConsole のエントリーポイント。サーバー(プラグイン / 開発用 API)が必須。
import LiveConsole from './LiveConsole.vue'
import { createBaseApp } from '@/common/EntryCore/core'
import '@assets/styles/DaisyUi.css'

createBaseApp(LiveConsole).mount('#App')
