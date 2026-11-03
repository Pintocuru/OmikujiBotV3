// src/registerAllUi.ts
// UI 関係の登録をすべてこのファイルに集約する窓口
import { registerUi, type UiLoader } from '@/ui/uiRegistry'
import type { UiKind } from '@/types/OmikujiData'
import { registerStandardBubbleComponents } from '@/ui/CommentBubble/components/standard/register'
import { registerStandardRankingComponents } from '@/ui/GameRanking/components/standard/register'
import { registerStandardClockComponents } from '@/ui/LiveClock/components/standard/register'
import { registerStandardKujibikiComponents } from '@/ui/KujibikiPanel/components/standard/register'
import { registerFortuneKujibikiComponents } from '@/ui/KujibikiPanel/components/fortune/register'
import { registerSpecialKujibikiComponents } from '@/ui/KujibikiPanel/components/special/register'

/** UI 種別本体の登録 */
const registerUiKinds = () =>
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

// CommentBubble
const registerBubbleComponents = () => {
  registerStandardBubbleComponents()
}

// GameRanking
const registerRankingComponents = () => {
  registerStandardRankingComponents()
}

// LiveClock
const registerClockComponents = () => {
  registerStandardClockComponents()
}

// KujibikiPanel
const registerKujibikiComponents = () => {
  registerStandardKujibikiComponents()
  registerFortuneKujibikiComponents()
  registerSpecialKujibikiComponents()
}

/** UI 関係を全部登録 */
export const registerAllUi = () => {
  registerUiKinds()
  registerBubbleComponents()
  registerRankingComponents()
  registerClockComponents()
  registerKujibikiComponents()
}
