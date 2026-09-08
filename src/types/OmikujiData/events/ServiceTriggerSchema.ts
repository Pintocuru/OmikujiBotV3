// src/types/OmikujiData/ServiceTriggerSchema.ts
import { z } from 'zod'

/**
 * 比較条件の種類
 */
export const serviceConditions = [
  'changed',
  'increased',
  'decreased',
  'greaterThanPeak',
  'lowerBound',
  'upperBound',
  'equal',
  'loop',
] as const

export const ServiceComparisonConditionSchema = z.enum(serviceConditions).default('changed').catch('changed')

export type ServiceComparisonConditionType = z.infer<typeof ServiceComparisonConditionSchema>

/**
 * ServiceConditionSchema
 */
export const ServiceConditionSchema = z.object({
  comparison: ServiceComparisonConditionSchema,
  value: z.number().min(0).optional(), // lowerBound / upperBound / equal / loop の時だけ使用
})
export type ServiceConditionType = z.infer<typeof ServiceConditionSchema>

/**
 * 配信数値条件の種類
 */
export const serviceTriggerConditions = ['upVote', 'viewer', 'follower', 'elapsedMinutes'] as const

export const ServiceTriggerConditionSchema = z.enum(serviceTriggerConditions).default('upVote').catch('upVote')
export type ServiceTriggerCondition = z.infer<typeof ServiceTriggerConditionSchema>

/**
 * ServiceTriggerSchema
 */
export const ServiceTriggerSchema = z.object({
  condition: ServiceTriggerConditionSchema,
  upVote: ServiceConditionSchema.optional(),
  viewer: ServiceConditionSchema.optional(),
  follower: z.literal(true).optional(),
  elapsedMinutes: z.number().min(0).optional(),
})

export type ServiceTriggerType = z.infer<typeof ServiceTriggerSchema>
