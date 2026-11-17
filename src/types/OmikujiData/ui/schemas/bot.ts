// src/types/OmikujiData/ui/schemas/bot.ts
import {
  CharacterStageSchema,
  CommentBubbleSchema,
  FlashBannerSchema,
  KujibikiPanelSchema,
  LiveClockSchema,
  ToastWidgetsSchema,
} from '@/types/ui/bot'

/** bot カテゴリの UI スキーマ */
export const botUiSchemas = {
  characterStage: CharacterStageSchema,
  commentBubble: CommentBubbleSchema,
  flashBanner: FlashBannerSchema,
  kujibikiPanel: KujibikiPanelSchema,
  liveClock: LiveClockSchema,
  toastWidgets: ToastWidgetsSchema,
} as const
