// src/main.ts
import App from './editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import { registerAll } from '@/register/registerAll'
import '@assets/styles/DaisyUiAll.css'

if (import.meta.env.DEV) {
  // 開発環境ではProduct側の登録入口が本体登録も含めて行う
  const { registerAllPrivate } = await import('@product/register/registerPrivate')
  registerAllPrivate()
} else {
  registerAll()
}

createAppNotOneSDK(App)
