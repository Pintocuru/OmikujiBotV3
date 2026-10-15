// src/types/OmikujiData/ui/UiSettingsSchema.ts
import { z } from 'zod'
import { CommentBubbleSchema } from '@/ui/types'

/**
 * uiKinds UI種別の定義マップ
 */
export const uiKinds = ['commentBubble'] as const

// 型の導出
export const UiKindSchema = z.enum(uiKinds)
export type UiKind = z.infer<typeof UiKindSchema>

/**
 * UI設定
 */
export const UiSettingsSchema = z.object({
  commentBubble: CommentBubbleSchema.optional(),
})
export type UiSettingsType = z.infer<typeof UiSettingsSchema>
