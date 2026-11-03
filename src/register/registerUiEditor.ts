// eeeee
import { type Component } from 'vue'
import { UiEditorDef, registerUiEditor } from '@/editor/ui/uiEditorRegistry'
import type { UiKind } from '@/types/OmikujiData'

type EditorLoader = () => Promise<{ default: Component }>
type EditorDef = EditorLoader | UiEditorDef

export const registerAllUiEditor = () => {
  // エディターの登録
  registerUiEditor({
    characterStage: {
      editor: () => import('@/ui/CharacterStage/editor/CharacterStageEditor.vue'),
      slotsEditor: () => import('@/ui/CharacterStage/editor/CharacterStageSlotsEditor.vue'),
      preview: () => import('@/ui/CharacterStage/editor/CharacterStagePreview.vue'),
    },
    commentBubble: () => import('@/ui/CommentBubble/editor/CommentBubbleEditor.vue'),
    cookieCounter: () => import('@/ui/CookieCounter/editor/CookieCounterEditor.vue'),
    gameRanking: {
      editor: () => import('@/ui/GameRanking/editor/GameRankingEditor.vue'),
      preview: () => import('@/ui/GameRanking/editor/GameRankingMessagePreview.vue'),
    },
    kujibikiPanel: {
      editor: () => import('@/ui/KujibikiPanel/editor/KujibikiPanelEditor.vue'),
      preview: () => import('@/ui/KujibikiPanel/editor/KujibikiPanelMessagePreview.vue'),
    },
    liveClock: {
      editor: () => import('@/ui/LiveClock/editor/LiveClockEditor.vue'),
      preview: () => import('@/ui/LiveClock/editor/LiveClockMessagePreview.vue'),
    },
    streamCounter: () => import('@/ui/StreamCounter/editor/StreamCounterEditor.vue'),
    toastWidgets: {
      editor: () => import('@/ui/ToastWidgets/editor/ToastWidgetsEditor.vue'),
      preview: () => import('@/ui/ToastWidgets/editor/ToastWidgetsMessagePreview.vue'),
    },
    userBoard: () => import('@/ui/UserBoard/editor/UserBoardEditor.vue'),
  } satisfies Record<UiKind, EditorDef>)
}
