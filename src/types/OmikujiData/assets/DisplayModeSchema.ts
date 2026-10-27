// src/types/OmikujiData/assets/DisplayModeSchema.ts
import { z } from 'zod'

/**
 * displayModes BOTコメント表現方法
 */
export const displayModes = ['comment', 'voice', 'none'] as const

// スキーマと型の定義
export const DisplayModeSchema = z.enum(displayModes).default('comment').catch('comment')
export type DisplayModeType = z.infer<typeof DisplayModeSchema>
