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
    cookieCounter: () => import('@/ui/counter/CookieCounter/editor/CookieCounterEditor.vue'),
    deadAir: () => import('@/ui/game/DeadAir/editor/DeadAirEditor.vue'),
    flightSeat: () => import('@/ui/user/FlightSeat/editor/FlightSeatEditor.vue'),
    flashBanner: {
      editor: () => import('@/ui/bot/FlashBanner/editor/FlashBannerEditor.vue'),
      preview: () => import('@/ui/bot/FlashBanner/editor/FlashBannerMessagePreview.vue'),
    },
    gameRanking: {
      editor: () => import('@/ui/game/GameRanking/editor/GameRankingEditor.vue'),
      preview: () => import('@/ui/game/GameRanking/editor/GameRankingMessagePreview.vue'),
    },
    kujibikiPanel: {
      editor: () => import('@/ui/bot/KujibikiPanel/editor/KujibikiPanelEditor.vue'),
      preview: () => import('@/ui/bot/KujibikiPanel/editor/KujibikiPanelMessagePreview.vue'),
    },
    labelMaker: () => import('@/ui/user/LabelMaker/editor/LabelMakerEditor.vue'),
    liveClock: {
      editor: () => import('@/ui/bot/LiveClock/editor/LiveClockEditor.vue'),
      preview: () => import('@/ui/bot/LiveClock/editor/LiveClockMessagePreview.vue'),
    },
    streamCounter: () => import('@/ui/counter/StreamCounter/editor/StreamCounterEditor.vue'),
    toastWidgets: {
      editor: () => import('@/ui/bot/ToastWidgets/editor/ToastWidgetsEditor.vue'),
      preview: () => import('@/ui/bot/ToastWidgets/editor/ToastWidgetsMessagePreview.vue'),
    },
    userBoard: () => import('@/ui/user/UserBoard/editor/UserBoardEditor.vue'),
    userComment: () => import('@/ui/comment/UserComment/editor/UserCommentEditor.vue'),
    lifeHourglass: () => import('@/ui/counter/LifeHourglass/editor/LifeHourglassEditor.vue'),
    liverBingo: () => import('@/ui/game/LiverBingo/editor/LiverBingoEditor.vue'),
    luckyDraw: () => import('@/ui/user/LuckyDraw/editor/LuckyDrawEditor.vue'),
    snipeTimer: () => import('@/ui/counter/SnipeTimer/editor/SnipeTimerEditor.vue'),
  } satisfies Record<UiKind, EditorDef>)
}
