// packages/common/OmikujiBot/main.ts
import App from '@/generator/App.vue'
import { createAppOneSDK } from '@/common/EntryCore/core'
import '@assets/styles/DaisyUiObs.css'

// レイアウト
registerLayout({
  // common
  commentBubble: () => import('@/layout/common/CommentBubble/CommentBubble.vue'),
  gameRanking: () => import('@/layout/common/GameRanking/GameRanking.vue'),
  kujibikiPanel: () => import('@/layout/common/KujibikiPanel/KujibikiPanel.vue'),

  // 2026-Q4
  lifeHourglass: () => import('@/layout/2026-Q4/LifeHourglass/LifeHourglass.vue'),
})

// UI
registerUi({
  characterStage: () => import('@/ui/bot/CharacterStage/CharacterStage.vue'),
  commentBubble: () => import('@/ui/bot/CommentBubble/CommentBubble.vue'),
  gameRanking: () => import('@/ui/game/GameRanking/GameRanking.vue'),
  kujibikiPanel: () => import('@/ui/bot/KujibikiPanel/KujibikiPanel.vue'),
  lifeHourglass: () => import('@/ui/counter/LifeHourglass/LifeHourglass.vue'),
})

// UIの各コンポーネント
// CommentBubble
registerBubbleBubbleComponents()
registerMessageBoardBubbleComponents()

// GameRanking
registerStandardRankingComponents()

// KujibikiPanel
registerStandardKujibikiComponents()
registerFortuneKujibikiComponents()
registerSpecialKujibikiComponents()

// LifeHourglass
registerStandardLifeHourglassComponents()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountGenerator = () => {
  createAppOneSDK(App)
}
