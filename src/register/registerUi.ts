// src/register/registerUi.ts
// UI 関係の登録をすべてこのファイルに集約する窓口
import { registerUi, type UiLoader } from '@/ui/uiRegistry'
import type { UiKind } from '@/types/OmikujiData'
import { registerBubbleBubbleComponents } from '@/ui/bot/CommentBubble/components/bubble/register'
import { registerMessageBoardBubbleComponents } from '@/ui/bot/CommentBubble/components/messageBoard/register'
import { registerStandardRankingComponents } from '@/ui/game/GameRanking/components/standard/register'
import { registerStandardDeadAirComponents } from '@/ui/game/DeadAir/components/standard/register'
import { registerStandardClockComponents } from '@/ui/bot/LiveClock/components/standard/register'
import { registerStandardFlashBannerComponents } from '@/ui/bot/FlashBanner/components/standard/register'
import { registerStandardStreamComponents } from '@/ui/counter/StreamCounter/components/standard/register'
import { registerStandardToastComponents } from '@/ui/bot/ToastWidgets/components/standard/register'
import { registerStandardBoardComponents } from '@/ui/user/UserBoard/components/standard/register'
import { registerStandardCookieComponents } from '@/ui/counter/CookieCounter/components/standard/register'
import { registerStandardKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/standard/register'
import { registerFortuneKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/fortune/register'
import { registerSpecialKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/special/register'
import { registerStandardLabelMakerComponents } from '@/ui/user/LabelMaker/components/standard/register'
import { registerStandardLifeHourglassComponents } from '@/ui/counter/LifeHourglass/components/standard/register'
import { registerStandardSnipeTimerComponents } from '@/ui/counter/SnipeTimer/components/standard/register'
import { registerStandardFlightSeatComponents } from '@/ui/user/FlightSeat/components/standard/register'
import { registerStandardLuckyDrawComponents } from '@/ui/user/LuckyDraw/components/standard/register'

/** UI 種別本体の登録 */
const registerUiKinds = () =>
  registerUi({
    characterStage: () => import('@/ui/bot/CharacterStage/CharacterStage.vue'),
    commentBubble: () => import('@/ui/bot/CommentBubble/CommentBubble.vue'),
    cookieCounter: () => import('@/ui/counter/CookieCounter/CookieCounter.vue'),
    deadAir: () => import('@/ui/game/DeadAir/DeadAir.vue'),
    flightSeat: () => import('@/ui/user/FlightSeat/FlightSeat.vue'),
    flashBanner: () => import('@/ui/bot/FlashBanner/FlashBanner.vue'),
    gameRanking: () => import('@/ui/game/GameRanking/GameRanking.vue'),
    kujibikiPanel: () => import('@/ui/bot/KujibikiPanel/KujibikiPanel.vue'),
    labelMaker: () => import('@/ui/user/LabelMaker/LabelMaker.vue'),
    lifeHourglass: () => import('@/ui/counter/LifeHourglass/LifeHourglass.vue'),
    liveClock: () => import('@/ui/bot/LiveClock/LiveClock.vue'),
    liverBingo: () => import('@/ui/game/LiverBingo/LiverBingo.vue'),
    luckyDraw: () => import('@/ui/user/LuckyDraw/LuckyDraw.vue'),
    snipeTimer: () => import('@/ui/counter/SnipeTimer/SnipeTimer.vue'),
    streamCounter: () => import('@/ui/counter/StreamCounter/StreamCounter.vue'),
    toastWidgets: () => import('@/ui/bot/ToastWidgets/ToastWidgets.vue'),
    userBoard: () => import('@/ui/user/UserBoard/UserBoard.vue'),
    userComment: () => import('@/ui/comment/UserComment/UserComment.vue'),
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

// FlashBanner
const registerFlashBannerComponents = () => {
  registerStandardFlashBannerComponents()
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

// LabelMaker
const registerLabelMakerComponents = () => {
  registerStandardLabelMakerComponents()
}

// SnipeTimer
const registerSnipeTimerComponents = () => {
  registerStandardSnipeTimerComponents()
}

// DeadAir
const registerDeadAirComponents = () => {
  registerStandardDeadAirComponents()
}

// FlightSeat
const registerFlightSeatComponents = () => {
  registerStandardFlightSeatComponents()
}

// LuckyDraw
const registerLuckyDrawComponentSets = () => {
  registerStandardLuckyDrawComponents()
}

/** UI 関係を全部登録 */
export const registerAllUi = () => {
  registerUiKinds()
  registerBubbleComponents()
  registerRankingComponents()
  registerClockComponents()
  registerCookieComponents()
  registerFlashBannerComponents()
  registerStreamComponents()
  registerToastComponents()
  registerBoardComponents()
  registerKujibikiComponents()
  registerLifeHourglassComponents()
  registerLabelMakerComponents()
  registerSnipeTimerComponents()
  registerFlightSeatComponents()
  registerDeadAirComponents()
  registerLuckyDrawComponentSets()
}
