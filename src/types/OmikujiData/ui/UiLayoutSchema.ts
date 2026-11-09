// src/types/OmikujiData/ui/UiLayoutSchema.ts
import { z } from 'zod'

/**
 * レイアウトプリセット
 */
export const uiLayouts = [
  // common
  'commentBubble',
  'gameRanking',
  'kujibikiPanel',

  // 2026-Q4
  'lifeHourglass',

  // 管理者用
  'sesupinTest',
] as const

// スキーマと型の定義
export const UiLayoutSchema = z.enum(uiLayouts)
export type UiLayoutType = z.infer<typeof UiLayoutSchema>
