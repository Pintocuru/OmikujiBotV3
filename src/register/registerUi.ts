// src/register/registerUi.ts
// UI 関係の登録をすべてこのファイルに集約する窓口
import { registerUi, type UiLoader } from '@/ui/uiRegistry'
import type { UiKind } from '@/types/OmikujiData'
import { registerBubbleBubbleComponents } from '@/ui/CommentBubble/components/bubble/register'
import { registerMessageBoardBubbleComponents } from '@/ui/CommentBubble/components/messageBoard/register'
import { registerStandardRankingComponents } from '@/ui/GameRanking/components/standard/register'
import { registerStandardClockComponents } from '@/ui/LiveClock/components/standard/register'
import { registerStandardStreamComponents } from '@/ui/StreamCounter/components/standard/register'
import { registerStandardToastComponents } from '@/ui/ToastWidgets/components/standard/register'
import { registerStandardBoardComponents } from '@/ui/UserBoard/components/standard/register'
import { registerStandardCookieComponents } from '@/ui/CookieCounter/components/standard/register'
import { registerStandardKujibikiComponents } from '@/ui/KujibikiPanel/components/standard/register'
import { registerFortuneKujibikiComponents } from '@/ui/KujibikiPanel/components/fortune/register'
import { registerSpecialKujibikiComponents } from '@/ui/KujibikiPanel/components/special/register'
import { registerStandardLifeHourglassComponents } from '@/ui/LifeHourglass/components/standard/register'
import { registerStandardSnipeTimerComponents } from '@/ui/SnipeTimer/components/standard/register'

/** UI 種別本体の登録 */
const registerUiKinds = () =>
  registerUi({
    characterStage: () => import('@/ui/CharacterStage/CharacterStage.vue'),
    commentBubble: () => import('@/ui/CommentBubble/CommentBubble.vue'),
    cookieCounter: () => import('@/ui/CookieCounter/CookieCounter.vue'),
    gameRanking: () => import('@/ui/GameRanking/GameRanking.vue'),
    kujibikiPanel: () => import('@/ui/KujibikiPanel/KujibikiPanel.vue'),
    lifeHourglass: () => import('@/ui/LifeHourglass/LifeHourglass.vue'),
    liveClock: () => import('@/ui/LiveClock/LiveClock.vue'),
    liverBingo: () => import('@/ui/LiverBingo/LiverBingo.vue'),
    snipeTimer: () => import('@/ui/SnipeTimer/SnipeTimer.vue'),
    streamCounter: () => import('@/ui/StreamCounter/StreamCounter.vue'),
    toastWidgets: () => import('@/ui/ToastWidgets/ToastWidgets.vue'),
    userBoard: () => import('@/ui/UserBoard/UserBoard.vue'),
  } satisfies Record<UiKind, UiLoader>)

// CommentBubble
const registerBubbleComponents = () => {
  registerBubbleBubbleComponents()
  registerMessageBoardBubbleComponents()
}

// GameRanking
const registerRankingComponents = () => {
  registerStandardRankingComponents()
}

// LiveClock
const registerClockComponents = () => {
  registerStandardClockComponents()
}

// StreamCounter
const registerStreamComponents = () => {
  registerStandardStreamComponents()
}

// ToastWidgets
const registerToastComponents = () => {
  registerStandardToastComponents()
}

// UserBoard
const registerBoardComponents = () => {
  registerStandardBoardComponents()
}

// CookieCounter
const registerCookieComponents = () => {
  registerStandardCookieComponents()
}

// KujibikiPanel
const registerKujibikiComponents = () => {
  registerStandardKujibikiComponents()
  registerFortuneKujibikiComponents()
  registerSpecialKujibikiComponents()
}

// LifeHourglass
const registerLifeHourglassComponents = () => {
  registerStandardLifeHourglassComponents()
}

// SnipeTimer
const registerSnipeTimerComponents = () => {
  registerStandardSnipeTimerComponents()
}

/** UI 関係を全部登録 */
export const registerAllUi = () => {
  registerUiKinds()
  registerBubbleComponents()
  registerRankingComponents()
  registerClockComponents()
  registerCookieComponents()
  registerStreamComponents()
  registerToastComponents()
  registerBoardComponents()
  registerKujibikiComponents()
  registerLifeHourglassComponents()
  registerSnipeTimerComponents()
}
