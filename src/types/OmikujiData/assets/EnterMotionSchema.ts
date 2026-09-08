// src/types/OmikujiData/assets/EnterMotionSchema.ts
import { z } from 'zod'

/**
 * モーション設定オブジェクトの型
 */
export interface EnterMotionConfig {
  label: string
  description: string
  initial: string
  enter: string
  leave: string
}

/**
 * 登場・退場モーションの種類（Array-first SSoT）
 */
export const enterMotions = [
  'none',
  'slideUp',
  'slideDown',
  'slideLeft',
  'slideRight',
  'flipInY',
  'flipX',
  'rotateIn',
  'zoomIn',
  'scale',
  'bounce',
  'rubberBand',
  'jello',
  'fade',
] as const

// スキーマと型の定義
export const EnterMotionSchema = z.enum(enterMotions).default('none').catch('none')
export type EnterMotionType = z.infer<typeof EnterMotionSchema>
