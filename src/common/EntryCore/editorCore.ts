// src/common/EntryCore/editorCore.ts
// ConfigMaker用：OneSDKへの依存ゼロ。
// i18n (Vite 専用の import.meta.glob を使う) を含むため、配布パッケージ(webpack)の entry からは import しないこと
import i18n from '@/editor/i18n'
import { createBaseApp } from './core'

export function createAppNotOneSDK(AppComponent: any, props?: any) {
  const app = createBaseApp(AppComponent, props)
  app.use(i18n)
  app.mount('#App')
}
