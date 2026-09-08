// src/types/trigger/AccessCondition.ts
import { z } from 'zod'

/**
 * アクセス権限条件の種類
 */
export const accessConditions = ['basic', 'member', 'moderator', 'owner', 'anonymous'] as const

// スキーマと型の定義
export const AccessConditionSchema = z.enum(accessConditions).default('basic').catch('basic')
export type AccessConditionTrigger = z.infer<typeof AccessConditionSchema>
