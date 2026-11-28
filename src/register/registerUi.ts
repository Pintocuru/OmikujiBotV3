// src/register/registerUi.ts
// UI 関係の登録をすべてこのファイルに集約する窓口
import { registerUi, type UiLoader } from '@/ui/uiRegistry'
import type { UiKind } from '@/types/OmikujiData'
import { registerBubbleBubbleComponents } from '@/ui/bot/CommentBubble/components/bubble/register'
import { registerMessageBoardBubbleComponents } from '@/ui/bot/CommentBubble/components/messageBoard/register'
import { registerStandardRankingComponents } from '@/ui/game/GameRanking/components/standard/register'
import { registerStandardKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/standard/register'
import { registerFortuneKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/fortune/register'
import { registerSpecialKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/special/register'

/** UI 種別本体の登録 */
const registerUiKinds = () =>
  registerUi({
    characterStage: () => import('@/ui/bot/CharacterStage/CharacterStage.vue'),
    commentBubble: () => import('@/ui/bot/CommentBubble/CommentBubble.vue'),
    gameRanking: () => import('@/ui/game/GameRanking/GameRanking.vue'),
    kujibikiPanel: () => import('@/ui/bot/KujibikiPanel/KujibikiPanel.vue'),
  } satisfies Partial<Record<UiKind, UiLoader>>)

// CommentBubble
const registerBubbleComponents = () => {
  registerBubbleBubbleComponents()
  registerMessageBoardBubbleComponents()
}

// GameRanking
const registerRankingComponents = () => {
  registerStandardRankingComponents()
}

// KujibikiPanel
const registerKujibikiComponents = () => {
  registerStandardKujibikiComponents()
  registerFortuneKujibikiComponents()
  registerSpecialKujibikiComponents()
}

export const registerAllUi = () => {
  registerUiKinds()
  registerBubbleComponents()
  registerRankingComponents()
  registerKujibikiComponents()
}
