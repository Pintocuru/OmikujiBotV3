// src/types/OmikujiData/ui/uiSchemas.stable.ts
import {
  CharacterStageSchema,
  CommentBubbleSchema,
  CookieCounterSchema,
  GameRankingSchema,
  KujibikiPanelSchema,
  LiveClockSchema,
  StreamCounterSchema,
  ToastWidgetsSchema,
  UserBoardSchema,
} from '@/types/ui'

/**
 * 安定版の UI(配布対象)。
 * キー名 = UiKind。ここに足す・消すだけで UiSettingsSchema に反映される。
 */
export const stableUiSchemas = {
  characterStage: CharacterStageSchema,
  commentBubble: CommentBubbleSchema,
  cookieCounter: CookieCounterSchema,
  gameRanking: GameRankingSchema,
  kujibikiPanel: KujibikiPanelSchema,
  liveClock: LiveClockSchema,
  streamCounter: StreamCounterSchema,
  toastWidgets: ToastWidgetsSchema,
  userBoard: UserBoardSchema,
} as const
