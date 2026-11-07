// src/types/engine/trigger/SyokenCondition.ts
import { z } from 'zod'

/**
 * 初見条件の種類
 */
export const syokenConditions = ['syoken', 'again', 'firstVisit'] as const

// スキーマと型の定義
// 配列の要素用(不正な値を別の値に置き換えず、normalizedArray で除外して記録する)
export const SyokenConditionValueSchema = z.enum(syokenConditions)
// 単独の値用(不正な値は 'syoken' に戻す)
export const SyokenConditionSchema = SyokenConditionValueSchema.default('syoken').catch('syoken')
export type SyokenConditionType = z.infer<typeof SyokenConditionSchema>
