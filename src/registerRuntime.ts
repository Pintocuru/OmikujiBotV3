// src/registerRuntime.ts
import { registerUi, registerLayout, type UiLoader } from '@/ui/uiRegistry'
import { registerGameScript, type GameScriptLoader } from '@/games/gameScriptRegistry'
import type { ScriptGameKey, UiKind, UiLayoutType } from '@/types/OmikujiData'

/**
 * 全部入りの登録(registerAll / 開発用)
 * - satisfies Record<...> により、src/types にキーを足して登録を忘れると型エラーになる
 * - パッケージ単体のエントリは、必要なものだけを自分で登録する
 */
export const registerAllUi = () =>
  registerUi({
    commentBubble: () => import('@/ui/CommentBubble/CommentBubble.vue'),
    cookieCounter: () => import('@/ui/CookieCounter/CookieCounter.vue'),
    gameRanking: () => import('@/ui/GameRanking/GameRanking.vue'),
    kujibikiPanel: () => import('@/ui/KujibikiPanel/KujibikiPanel.vue'),
    liveClock: () => import('@/ui/LiveClock/LiveClock.vue'),
    streamCounter: () => import('@/ui/StreamCounter/StreamCounter.vue'),
    toastWidgets: () => import('@/ui/ToastWidgets/ToastWidgets.vue'),
    userBoard: () => import('@/ui/UserBoard/UserBoard.vue'),
  } satisfies Record<UiKind, UiLoader>)

export const registerAllLayouts = () =>
  registerLayout({
    commentBubble: () => import('@/layout/CommentBubble/CommentBubble.vue'),
    gameRanking: () => import('@/layout/GameRanking/GameRanking.vue'),
  } satisfies Record<UiLayoutType, UiLoader>)

export const registerAllGameScripts = () =>
  registerGameScript({
    GouseiSuika: () => import('@/games/scripts/GouseiSuika/execute'),
    BomberSpin: () => import('@/games/scripts/BomberSpin/execute'),
    DwarfBomb: () => import('@/games/scripts/DwarfBomb/execute'),
    MultiplyBonanza: () => import('@/games/scripts/MultiplyBonanza/execute'),
    GoogolClover: () => import('@/games/scripts/GoogolClover/execute'),
    HugEmAll: () => import('@/games/scripts/HugEmAll/execute'),
  } satisfies Record<ScriptGameKey, GameScriptLoader>)

export const registerRuntime = () => {
  registerAllUi()
  registerAllLayouts()
  registerAllGameScripts()
}
