// src/types/engine/trigger/ServiceCondition.ts
import z from 'zod'

/**
 * 配信メタ条件の種類
 */
export const serviceMetaConditions = ['viewer', 'upVote', 'follower'] as const

// スキーマと型の定義
export const ServiceMetaConditionSchema = z.enum(serviceMetaConditions)
export type ServiceMetaCondition = z.infer<typeof ServiceMetaConditionSchema>
