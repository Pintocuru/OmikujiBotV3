// packages/common/OmikujiBot/register.ts
import type { UiKind } from '@/types/OmikujiData'
import { registerLayout, registerUi, type UiLoader } from '@/ui/uiRegistry'
import { registerGameScript } from '@/games/gameScriptRegistry'
import { registerUiEditor } from '@/editor/ui/uiEditorRegistry'
import { markFullBuild } from '@/common/buildValidation/fullBuild'

// 各種コンポーネント登録
import { registerBubbleBubbleComponents } from '@/ui/bot/CommentBubble/components/bubble/register'
import { registerMessageBoardBubbleComponents } from '@/ui/bot/CommentBubble/components/messageBoard/register'
import { registerStandardRankingComponents } from '@/ui/game/GameRanking/components/standard/register'
import { registerStandardKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/standard/register'
import { registerFortuneKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/fortune/register'
import { registerSpecialKujibikiComponents } from '@/ui/bot/KujibikiPanel/components/special/register'

// リリース対象
type ReleaseUiKind = 'characterStage' | 'commentBubble' | 'gameRanking' | 'kujibikiPanel'
type ReleaseLayoutKey = 'commentBubble' | 'gameRanking' | 'kujibikiPanel'

// UI本体
const uiLoaders = {
  characterStage: () => import('@/ui/bot/CharacterStage/CharacterStage.vue'),
  commentBubble: () => import('@/ui/bot/CommentBubble/CommentBubble.vue'),
  gameRanking: () => import('@/ui/game/GameRanking/GameRanking.vue'),
  kujibikiPanel: () => import('@/ui/bot/KujibikiPanel/KujibikiPanel.vue'),
} satisfies Record<ReleaseUiKind, UiLoader>

// レイアウト
const layoutLoaders = {
  commentBubble: () => import('@/layout/common/CommentBubble/CommentBubble.vue'),
  gameRanking: () => import('@/layout/common/GameRanking/GameRanking.vue'),
  kujibikiPanel: () => import('@/layout/common/KujibikiPanel/KujibikiPanel.vue'),
} satisfies Record<ReleaseLayoutKey, UiLoader>

// エディター
const uiEditors = {
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
} satisfies Record<ReleaseUiKind, Parameters<typeof registerUiEditor>[0][UiKind]>

export const registerMain = () => {
  registerLayout(layoutLoaders)
  registerUi(uiLoaders)

  // CommentBubble
  registerBubbleBubbleComponents()
  registerMessageBoardBubbleComponents()

  // GameRanking
  registerStandardRankingComponents()

  // KujibikiPanel
  registerStandardKujibikiComponents()
  registerFortuneKujibikiComponents()
  registerSpecialKujibikiComponents()

  // スクリプト
  registerGameScript({
    GouseiSuika: () => import('@/games/scripts/game/GouseiSuika/execute'),
    CommentBot: () => import('@/games/scripts/tool/CommentBot/execute'),
  })

  // 「これまでリリースしたもの全部入り」のビルド
  markFullBuild()
}

export const registerEditor = () => {
  registerUiEditor(uiEditors)
}
