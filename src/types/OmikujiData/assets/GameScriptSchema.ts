// src/types/OmikujiData/assets/GameScriptSchema.ts
import { z } from 'zod'

/**
 * Public に残すゲームスクリプトのキー
 */
export const knownGameScriptKeys = ['GouseiSuika', 'CommentBot'] as const
export type KnownGameScriptKey = (typeof knownGameScriptKeys)[number]
export type GameScriptKey = KnownGameScriptKey | (string & {})
export const gameScriptKeys = knownGameScriptKeys

// スキーマと型の定義
export const GameScriptKeySchema = z.string()

export const isGameScriptKey = (value: string): value is GameScriptKey =>
  typeof value === 'string' && value.length > 0
