// src/types/OmikujiData/ui/UiLayoutSchema.ts
import { z } from 'zod'

/**
 * レイアウトプリセット
 */
export const uiLayouts = ['CommentBubble'] as const

// スキーマと型の定義
export const UiLayoutSchema = z.enum(uiLayouts)
export type UiLayoutType = z.infer<typeof UiLayoutSchema>
