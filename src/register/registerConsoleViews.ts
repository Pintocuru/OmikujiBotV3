// src/register/registerConsoleViews.ts
// 開発用(src/console/main.ts)の「全部入り」登録。配布パッケージは packages/*/console.ts で、必要な画面だけを登録する
import { registerConsoleView, type ConsoleViewLoader } from '@/console/consoleRegistry'
import type { ConsoleViewKey } from '@/console/maps/ConsoleViewMap'

export const registerAllConsoleViews = () =>
  registerConsoleView({
    // control
    eventPads: () => import('@/console/control/EventPads/EventPads.vue'),
    bingoConsole: () => import('@/console/control/BingoConsole/BingoConsole.vue'),
    usersConsole: () => import('@/console/control/UsersConsole/UsersConsole.vue'),
    // log
    gameLog: () => import('@/console/log/GameLog/GameLog.vue'),
    // game
    userRace: () => import('@/console/game/UserRace/UserRace.vue'),
    oshikuraChain: () => import('@/console/game/NuisanceSurvival/OshikuraChain.vue'),
  } satisfies Record<ConsoleViewKey, ConsoleViewLoader>)
