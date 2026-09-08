//
import { z } from 'zod'

/**
 * アニメーション
 */
export const loopMotions = [
  'none',
  'bounce',
  'shake',
  'swing',
  'wobble',
  'rotate',
  'rotateR',
  'rubberBand',
  'jello',
  'tilt',
  'headShake',
  'pulse',
  'flash',
  'tada',
  'combo',
  'joyful',
  'gentle',
] as const

// スキーマと型の定義
export const LoopMotionSchema = z.enum(loopMotions).default('none').catch('none')
export type LoopMotionType = z.infer<typeof LoopMotionSchema>
