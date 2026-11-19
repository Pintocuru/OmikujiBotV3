// src/console/main.ts
// LiveConsole のエントリーポイント。サーバー(プラグイン / 開発用 API)が必須。
import LiveConsole from './LiveConsole.vue'
import { createBaseApp } from '@/common/EntryCore/core'
import { registerAllConsoleViews } from '@/register/registerConsoleViews'
import '@assets/styles/DaisyUi.css'

// 開発用は全部入り
registerAllConsoleViews()
createBaseApp(LiveConsole).mount('#App')
