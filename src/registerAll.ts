// src/registerAll.ts
import { registerUiEditor } from '@/editor/ui/uiEditorRegistry'
import type { Component } from 'vue'
import type { UiKind } from '@/types/OmikujiData'
import { registerRuntime } from '@/registerRuntime'

type EditorLoader = () => Promise<{ default: Component }>

export const registerAll = () => {
  // UI・レイアウト・gameScript の登録(ジェネレーターと共通)
  registerRuntime()

  // エディターの登録
  registerUiEditor({
    commentBubble: () => import('@/ui/CommentBubble/editor/CommentBubbleEditor.vue'),
    cookieCounter: () => import('@/ui/CookieCounter/editor/CookieCounterEditor.vue'),
    gameRanking: () => import('@/ui/GameRanking/editor/GameRankingEditor.vue'),
    kujibikiPanel: () => import('@/ui/KujibikiPanel/editor/KujibikiPanelEditor.vue'),
    liveClock: () => import('@/ui/LiveClock/editor/LiveClockEditor.vue'),
    streamCounter: () => import('@/ui/StreamCounter/editor/StreamCounterEditor.vue'),
    toastWidgets: () => import('@/ui/ToastWidgets/editor/ToastWidgetsEditor.vue'),
  } satisfies Record<UiKind, EditorLoader>)
}
