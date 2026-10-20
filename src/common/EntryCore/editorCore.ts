// src/common/EntryCore/editorCore.ts
// エディター用：OneSDKへの依存ゼロ。i18n を含む (Vite / webpack の両方で動く)
import i18n from '@/editor/i18n'
import { createBaseApp } from './core'

export function createAppNotOneSDK(AppComponent: any, props?: any) {
  const app = createBaseApp(AppComponent, props)
  app.use(i18n)
  app.mount('#App')
}
