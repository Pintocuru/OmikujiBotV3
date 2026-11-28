// src/types/OmikujiData/ui/UiLayoutSchema.ts
import { z } from 'zod'

/**
 * レイアウトプリセット
 */
export const uiLayouts = ['commentBubble', 'gameRanking', 'kujibikiPanel'] as const

export const UiLayoutSchema = z.string()
export type UiLayoutType = z.infer<typeof UiLayoutSchema>
