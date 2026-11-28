// src/register/registerUiEditor.ts
import { type Component } from 'vue'
import { UiEditorDef, registerUiEditor } from '@/editor/ui/uiEditorRegistry'
import type { UiKind } from '@/types/OmikujiData'

type EditorLoader = () => Promise<{ default: Component }>
type EditorDef = EditorLoader | UiEditorDef

export const registerAllUiEditor = () => {
  // エディターの登録
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
  } satisfies Partial<Record<UiKind, EditorDef>>)
}
