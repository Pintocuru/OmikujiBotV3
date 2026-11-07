// src/types/engine/trigger/AccessCondition.ts
import { z } from 'zod'

/**
 * アクセス権限条件の種類
 */
export const accessConditions = ['basic', 'member', 'moderator', 'owner', 'anonymous'] as const

// スキーマと型の定義
// 配列の要素用(不正な値を別の値に置き換えず、normalizedArray で除外して記録する)
export const AccessConditionValueSchema = z.enum(accessConditions)
// 単独の値用(不正な値は 'basic' に戻す)
export const AccessConditionSchema = AccessConditionValueSchema.default('basic').catch('basic')
export type AccessConditionType = z.infer<typeof AccessConditionSchema>
