// src/types/OmikujiData/SoundKey.ts
import { z } from 'zod'

/**
 * サウンドキーの種類
 */
export const soundKeys = [
  'cute',
  'bubble',
  'twinkle',
  'bounce',
  'jingle',
  'collect',
  'cash',
  'notification',
  'news',
  'decision',
  'transition',
  'congrats',
  'fanfare',
  'carnival',
  'baseball',
  'warn',
  'cancel',
  'negative',
  'fail',
  'explosion',
] as const

// スキーマと型の定義
export const SoundKeySchema = z.enum(soundKeys)
export type SoundKeyType = z.infer<typeof SoundKeySchema>
