// shared/types/Threshold/SyokenCondition.ts
import { z } from 'zod'

/**
 * 初見条件の種類
 */
export const syokenConditions = ['syoken', 'again', 'firstVisit'] as const

// スキーマと型の定義
export const SyokenConditionSchema = z.enum(syokenConditions).default('syoken').catch('syoken')
export type SyokenCondition = z.infer<typeof SyokenConditionSchema>
