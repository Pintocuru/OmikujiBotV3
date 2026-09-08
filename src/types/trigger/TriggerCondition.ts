// src/types/trigger/TriggerCondition.ts
import { z } from 'zod'

/**
 * トリガーの種類
 */
export const triggerConditions = [
  'comment',
  'syoken',
  'access',
  'gift',
  'count',
  'service',
  'userId',
  'username',
  'timeRange',
] as const

// キーの型
export const TriggerConditionSchema = z.enum(triggerConditions)
export type TriggerCondition = z.infer<typeof TriggerConditionSchema>
