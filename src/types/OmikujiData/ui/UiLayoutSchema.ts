// src/types/OmikujiData/ui/UiLayoutSchema.ts
import { z } from 'zod'

/**
 * レイアウトプリセット
 */
export const uiLayouts = ['OmikujiBot', 'VarietySlot', 'VarietySlotRanking', 'GogoBonus', 'Golden65536'] as const

// スキーマと型の定義
export const UiLayoutSchema = z.enum(uiLayouts).nullable().default(null).catch(null)
export type UiLayoutType = z.infer<typeof UiLayoutSchema>
