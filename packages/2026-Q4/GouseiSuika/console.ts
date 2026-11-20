// packages/2026-Q4/GouseiSuika/console.ts
import LiveConsole from '@/console/App.vue'
import { createBaseApp } from '@/common/EntryCore/core'
import { registerConsoleView } from '@/console/consoleRegistry'
import '@assets/styles/DaisyUi.css'

// このパッケージに同梱する画面
registerConsoleView({
  gameLog: () => import('@/console/log/GameLog/GameLog.vue'),
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountConsole = () => {
  createBaseApp(LiveConsole).mount('#App')
}
