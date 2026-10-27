// src/types/OmikujiData/assets/GameScriptSchema.ts
import { z } from 'zod'

/**
 * ゲームスクリプトのキー
 */
export const gameScriptKeys = [
  'GouseiSuika',
  'BomberSpin',
  'DwarfBomb',
  'MultiplyBonanza',
  'GoogolClover',
  'HugEmAll',
  'FortuneRanking',
] as const

// スキーマと型の定義
export const GameScriptKeySchema = z.enum(gameScriptKeys)
export type GameScriptKey = z.infer<typeof GameScriptKeySchema>

export const isGameScriptKey = (value: string): value is GameScriptKey => GameScriptKeySchema.safeParse(value).success
