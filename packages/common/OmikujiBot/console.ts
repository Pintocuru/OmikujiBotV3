// packages/common/OmikujiBot/console.ts
import LiveConsole from '@/console/App.vue'
import { createBaseApp } from '@/common/EntryCore/core'
import { registerConsoleView } from '@/console/consoleRegistry'
import '@assets/styles/DaisyUi.css'

// コンソール
registerConsoleView({
  // control
  eventPads: () => import('@/console/control/EventPads/EventPads.vue'),
  usersConsole: () => import('@/console/control/UsersConsole/UsersConsole.vue'),

  // log
  gameLog: () => import('@/console/log/GameLog/GameLog.vue'),

  // game
  // まだない
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountConsole = () => {
  createBaseApp(LiveConsole).mount('#App')
}
