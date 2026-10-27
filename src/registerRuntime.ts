// src/registerRuntime.ts
import { registerUi, registerLayout, type UiLoader } from '@/ui/uiRegistry'
import { registerGameScript, type GameScriptLoader } from '@/games/gameScriptRegistry'
import type { GameScriptKey, UiKind, UiLayoutType } from '@/types/OmikujiData'

/**
 * 全部入りの登録(registerAll / 開発用)
 * - パッケージ単体のエントリは、必要なものだけを自分で登録する
 */

// UI
export const registerAllUi = () =>
  registerUi({
    characterStage: () => import('@/ui/CharacterStage/CharacterStage.vue'),
    commentBubble: () => import('@/ui/CommentBubble/CommentBubble.vue'),
    cookieCounter: () => import('@/ui/CookieCounter/CookieCounter.vue'),
    gameRanking: () => import('@/ui/GameRanking/GameRanking.vue'),
    kujibikiPanel: () => import('@/ui/KujibikiPanel/KujibikiPanel.vue'),
    liveClock: () => import('@/ui/LiveClock/LiveClock.vue'),
    streamCounter: () => import('@/ui/StreamCounter/StreamCounter.vue'),
    toastWidgets: () => import('@/ui/ToastWidgets/ToastWidgets.vue'),
    userBoard: () => import('@/ui/UserBoard/UserBoard.vue'),
  } satisfies Record<UiKind, UiLoader>)

// Layout
export const registerAllLayouts = () =>
  registerLayout({
    commentBubble: () => import('@/layout/CommentBubble/CommentBubble.vue'),
    gameRanking: () => import('@/layout/GameRanking/GameRanking.vue'),
    sesupinTest: () => import('@/layout/SesupinTest/SesupinTest.vue'),
  } satisfies Record<UiLayoutType, UiLoader>)

// GameScript
export const registerAllGameScripts = () =>
  registerGameScript({
    GouseiSuika: () => import('@/games/scripts/game/GouseiSuika/execute'),
    BomberSpin: () => import('@/games/scripts/game/BomberSpin/execute'),
    DwarfBomb: () => import('@/games/scripts/game/DwarfBomb/execute'),
    MultiplyBonanza: () => import('@/games/scripts/game/MultiplyBonanza/execute'),
    GoogolClover: () => import('@/games/scripts/game/GoogolClover/execute'),
    HugEmAll: () => import('@/games/scripts/game/HugEmAll/execute'),
    FortuneRanking: () => import('@/games/scripts/tool/FortuneRanking/execute'),
  } satisfies Record<GameScriptKey, GameScriptLoader>)

// runtime(editor除く)
export const registerRuntime = () => {
  registerAllUi()
  registerAllLayouts()
  registerAllGameScripts()
}
