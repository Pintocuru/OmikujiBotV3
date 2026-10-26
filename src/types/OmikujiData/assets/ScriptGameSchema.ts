// src/types/OmikujiData/assets/ScriptGameSchema.ts
import { z } from 'zod'

/**
 * ゲームスクリプトのキー
 */
export const scriptGameKeys = [
  'GouseiSuika',
  'BomberSpin',
  'DwarfBomb',
  'MultiplyBonanza',
  'GoogolClover',
  'HugEmAll',
  'FortuneRanking',
] as const

// スキーマと型の定義
export const ScriptGameKeySchema = z.enum(scriptGameKeys)
export type ScriptGameKey = z.infer<typeof ScriptGameKeySchema>

export const isScriptGameKey = (value: string): value is ScriptGameKey => ScriptGameKeySchema.safeParse(value).success
