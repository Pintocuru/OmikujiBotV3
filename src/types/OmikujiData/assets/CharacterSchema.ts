// src/types/OmikujiData/assets/CharacterSchema.ts
import { z } from 'zod'
import { BaseRecordSchema } from '@/types/core'
import { normalizedObject, normalizedRecord } from '@/types/core/ParsedDefault'
import { LoopMotionSchema } from './LoopMotionSchema'
import { DisplayModeSchema } from './DisplayModeSchema'

/**
 * CharacterColorSchema
 */
export const CharacterColorSchema = z.object({
  name: z.string().default('#212121').catch('#212121'),
  text: z.string().default('#212121').catch('#212121'),
  background: z.string().default('#FAFAFA').catch('#FAFAFA'),
  accent: z.string().default('#FF9800').catch('#FF9800'),
})
export type CharacterColorType = z.infer<typeof CharacterColorSchema>

/**
 * アニメーション方法
 */
export const CharacterAnimationSchema = z.object({
  type: LoopMotionSchema,
  durationSeconds: z.number().default(1.5).catch(1.5), // 1サイクルの秒数
  loop: z.boolean().default(true).catch(true),
})
export type CharacterAnimationType = z.infer<typeof CharacterAnimationSchema>

/**
 * 画像セット
 */
export const CharacterImageSchema = z.object({
  label: z.string().default('').catch(''),
  src: z.array(z.string()).catch([]),
  animation: CharacterAnimationSchema.optional(),
})
export type CharacterImageType = z.infer<typeof CharacterImageSchema>

// 感情キー -> 画像。1つの画像定義が壊れても、他の画像は残す
export const CharacterImageSetSchema = z.record(z.string(), CharacterImageSchema)
export type CharacterImageSetType = z.infer<typeof CharacterImageSetSchema>

/**
 * DisplayOptionSchema
 */
export const DisplayOptionSchema = z.object({
  mode: DisplayModeSchema,
  imageBase64: z.string().default('').catch(''), // 表示時のアイコン
  frameId: z.string().default('').catch(''), // わんコメの枠指定
})
export type DisplayOptionType = z.infer<typeof DisplayOptionSchema>

/**
 * CharacterSchema
 */
export const CharacterSchema = BaseRecordSchema.extend({
  displayName: z.string().default('').catch(''),
  color: normalizedObject(CharacterColorSchema, 'assets.characters.color'),
  image: normalizedRecord(CharacterImageSchema, 'assets.characters.image'),
  displayOption: normalizedObject(DisplayOptionSchema, 'assets.characters.displayOption'),
})
export type CharacterType = z.infer<typeof CharacterSchema>
