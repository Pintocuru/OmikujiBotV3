// shared/types/core/AccessLevelSchema.ts
import { z } from 'zod'

// 製品アクセスレベル
export const AccessLevelLabels = [
  'none', // 製品に含めない
  'basic', // 無料版
  'adv', // 上位版
  'pro', // PRO版
  'godMode', // 内部用
] as const

export type AccessLevelType = (typeof AccessLevelLabels)[number]
export const AccessLevelSchema = z.enum(AccessLevelLabels)
