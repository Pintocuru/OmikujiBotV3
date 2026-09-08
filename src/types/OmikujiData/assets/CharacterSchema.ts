// src/types/OmikujiData/CharacterSchema.ts
import { z } from 'zod'
import { normalizedObject } from '../ParsedDefault'
import { BaseRecordSchema } from '../../core/BaseSchema'
import { loopMotions } from './LoopMotionsSchema'
import { displayModes } from './DisplayModeSchema'

/**
 * CharacterColorSchema
 */
export const CharacterColorScheme = z.object({
  name: z.string().default('#212121').catch('#212121'),
  text: z.string().default('#212121').catch('#212121'),
  background: z.string().default('#FAFAFA').catch('#FAFAFA'),
  accent: z.string().default('#FF9800').catch('#FF9800'),
})
export type CharacterColorType = z.infer<typeof CharacterColorScheme>

/**
 * アニメーション方法
 */
export const CharacterAnimationSchema = z.object({
  type: z.enum(loopMotions).default('none').catch('none'),
  duration: z.number().default(1.5).catch(1.5),
  loop: z.boolean().default(true).catch(true),
})
export type CharacterAnimationType = z.infer<typeof CharacterAnimationSchema>

/**
 * 画像セット
 */
export const CharacterImageSchema = z.object({
  label: z.string().default(''),
  src: z.array(z.string()).catch([]),
  animation: CharacterAnimationSchema.optional(),
})

export const CharacterImageSetSchema = z.record(z.string(), CharacterImageSchema)
export type CharacterImageType = z.infer<typeof CharacterImageSetSchema>

/**
 * DisplayOptionSchema
 */
export const DisplayOptionSchema = z.object({
  mode: z.enum(displayModes).default('comment'),
  imageBase64: z.string().default('').catch(''), // 表示時のアイコン
  frameId: z.string().default('').catch(''), // わんコメの枠指定
})
export type DisplayOptionType = z.infer<typeof DisplayOptionSchema>

/**
 * CharacterSchema
 */
export const CharacterSchema = BaseRecordSchema.extend({
  displayName: z.string().default('').catch(''),
  color: normalizedObject(CharacterColorScheme),
  image: normalizedObject(CharacterImageSetSchema),
  displayOption: normalizedObject(DisplayOptionSchema),
})
export type CharacterType = z.infer<typeof CharacterSchema>
