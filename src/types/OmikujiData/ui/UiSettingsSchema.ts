// src/types/OmikujiData/ui/UiSettingsSchema.ts
import { z } from 'zod'
import {
  CharacterStageSchema,
  CommentBubbleSchema,
  CookieCounterSchema,
  KujibikiPanelSchema,
  LiveClockSchema,
  StreamCounterSchema,
  ToastWidgetsSchema,
  GameRankingSchema,
  UserBoardSchema,
} from '@/types/ui'

/**
 * uiKinds UI種別の定義マップ
 */
export const uiKinds = [
  'characterStage',
  'commentBubble',
  'cookieCounter',
  'gameRanking',
  'kujibikiPanel',
  'liveClock',
  'streamCounter',
  'toastWidgets',
  'userBoard',
] as const

// 型の導出
export const UiKindSchema = z.enum(uiKinds)
export type UiKind = z.infer<typeof UiKindSchema>

/**
 * UI設定
 */
export const UiSettingsSchema = z.object({
  characterStage: CharacterStageSchema.optional(),
  commentBubble: CommentBubbleSchema.optional(),
  cookieCounter: CookieCounterSchema.optional(),
  gameRanking: GameRankingSchema.optional(),
  kujibikiPanel: KujibikiPanelSchema.optional(),
  liveClock: LiveClockSchema.optional(),
  streamCounter: StreamCounterSchema.optional(),
  toastWidgets: ToastWidgetsSchema.optional(),
  userBoard: UserBoardSchema.optional(),
})
export type UiSettingsType = z.infer<typeof UiSettingsSchema>
