// shared/types/trigger/CountConditionTrigger.ts
import { z } from 'zod'

/**
 * comparison
 */
export const countComparisonConditions = ['lowerBound', 'upperBound', 'equal', 'loop'] as const

export const CountComparisonConditionSchema = z
  .enum(countComparisonConditions)
  .default('lowerBound')
  .catch('lowerBound')
export type CountComparisonCondition = z.infer<typeof CountComparisonConditionSchema>

/**
 * unit
 */
export const countUnitConditions = ['lc', 'tc', 'draws'] as const

export const CountUnitConditionSchema = z.enum(countUnitConditions).default('draws').catch('draws')
export type CountUnitCondition = z.infer<typeof CountUnitConditionSchema>

/**
 * Schema
 */
export const CountConditionSchema = z.object({
  comparison: CountComparisonConditionSchema,
  unit: CountUnitConditionSchema,
  value: z.number().min(0).default(1).catch(1),
})

export type CountConditionTriggerType = z.infer<typeof CountConditionSchema>
