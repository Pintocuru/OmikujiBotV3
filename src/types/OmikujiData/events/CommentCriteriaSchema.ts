// src/types/OmikujiData/CriteriaThresholdSchema.ts
import { z } from 'zod'
import { AccessConditionSchema, CountConditionSchema, GiftConditionSchema, SyokenConditionSchema } from '../../trigger'

/**
 * criteria Threshold
 */
export const criteriaThresholdCondition = [
  'username',
  'access', // アクセスレベル(管理者権限など)
  'gift', // プレミアムモードで使えるので
  'syoken',
  'count',
  'comment', // 追加のコメント内容
] as const
export type CriteriaThresholdCondition = (typeof criteriaThresholdCondition)[number]

export const CriteriaThresholdSchema = z.object({
  conditions: z.array(z.enum(criteriaThresholdCondition)).catch([]),
  userName: z.array(z.string()).catch([]),
  access: z.array(AccessConditionSchema).catch([]),
  gift: z.array(GiftConditionSchema).catch([]),
  syoken: z.array(SyokenConditionSchema).catch([]),
  count: CountConditionSchema.catch(CountConditionSchema.parse({})),
  comment: z.array(z.string()).catch([]),
})
export type CriteriaThresholdType = z.infer<typeof CriteriaThresholdSchema>
