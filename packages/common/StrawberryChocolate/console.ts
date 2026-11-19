// packages/common/StrawberryChocolate/console.ts
// LiveConsole 用のアクセスポイント。build.ts の getProjects で withConsole を true にしたときだけ同梱される
import LiveConsole from '@/console/LiveConsole.vue'
import { createBaseApp } from '@/common/EntryCore/core'
import { registerConsoleView } from '@/console/consoleRegistry'
import '@assets/styles/DaisyUi.css'

// このパッケージに同梱する画面。使わない画面は、ここから消すと配布物から外れる
registerConsoleView({
  eventPads: () => import('@/console/control/EventPads/EventPads.vue'),
  bingoConsole: () => import('@/console/control/BingoConsole/BingoConsole.vue'),
  usersConsole: () => import('@/console/control/UsersConsole/UsersConsole.vue'),
  gameLog: () => import('@/console/log/GameLog/GameLog.vue'),
})

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountConsole = () => {
  createBaseApp(LiveConsole).mount('#App')
}
