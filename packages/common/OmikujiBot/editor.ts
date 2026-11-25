// packages/common/OmikujiBot/editor.ts
import EditorApp from '@/editor/App.vue'
import { createAppNotOneSDK } from '@/common/EntryCore/editorCore'
import { registerLayout, registerUi } from '@/ui/uiRegistry'
import { registerGameScript } from '@/games/gameScriptRegistry'
import { registerUiEditor } from '@/editor/ui/uiEditorRegistry'
import { markFullBuild } from '@/common/buildValidation/fullBuild'

import '@assets/styles/DaisyUi.css'
import { registerBubbleBubbleComponents } from '@/ui/bot/CommentBubble/components/bubble/register'
import { registerMessageBoardBubbleComponents } from '@/ui/bot/CommentBubble/components/messageBoard/register'
import { registerStandardRankingComponents } from '@/ui/game/GameRanking/components/standard/register'
import { registerStandardKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/standard/register'
import { registerFortuneKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/fortune/register'
import { registerSpecialKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/special/register'
import { registerStandardLifeHourglassComponents } from '@/ui/counter/LifeHourglass/components/standard/register'

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

// エディター
registerUiEditor({
  characterStage: {
    editor: () => import('@/ui/bot/CharacterStage/editor/CharacterStageEditor.vue'),
    slotsEditor: () => import('@/ui/bot/CharacterStage/editor/CharacterStageSlotsEditor.vue'),
    preview: () => import('@/ui/bot/CharacterStage/editor/CharacterStagePreview.vue'),
  },
  commentBubble: () => import('@/ui/bot/CommentBubble/editor/CommentBubbleEditor.vue'),
  gameRanking: {
    editor: () => import('@/ui/game/GameRanking/editor/GameRankingEditor.vue'),
    preview: () => import('@/ui/game/GameRanking/editor/GameRankingMessagePreview.vue'),
  },
  kujibikiPanel: {
    editor: () => import('@/ui/bot/KujibikiPanel/editor/KujibikiPanelEditor.vue'),
    preview: () => import('@/ui/bot/KujibikiPanel/editor/KujibikiPanelMessagePreview.vue'),
  },
  lifeHourglass: () => import('@/ui/counter/LifeHourglass/editor/LifeHourglassEditor.vue'),
})

// スクリプト
registerGameScript({
  GouseiSuika: () => import('@/games/scripts/game/GouseiSuika/execute'),
  BomberSpin: () => import('@/games/scripts/game/BomberSpin/execute'),
  DwarfBomb: () => import('@/games/scripts/game/DwarfBomb/execute'),
})

// 全部入りの印(これまでリリースしたもの全部。DataPacks のダウンロード、レイアウト選択の表示に使う)
markFullBuild()

window.OmikujiBot = window.OmikujiBot ?? {}
window.OmikujiBot.mountEditor = () => {
  createAppNotOneSDK(EditorApp)
}
