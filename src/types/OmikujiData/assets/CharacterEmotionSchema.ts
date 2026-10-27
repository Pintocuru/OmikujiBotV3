// src/types/OmikujiData/assets/CharacterEmotionSchema.ts
import { z } from 'zod'

/**
 * CharacterEmotion ジェネレーター用画像設定
 */
export const characterEmotions = ['default', 'happy', 'surprised', 'sad', 'angry', 'thinking'] as const

// スキーマと型の定義
export const CharacterEmotionSchema = z.enum(characterEmotions).default('default').catch('default')
export type CharacterEmotionType = z.infer<typeof CharacterEmotionSchema>
