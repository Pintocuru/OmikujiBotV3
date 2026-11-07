// src/types/OmikujiData/events/CommentCriteriaSchema.ts
import { z } from 'zod'
import { normalizedArray } from '@/types/core/ParsedDefault'
import { CountConditionSchema, SyokenConditionValueSchema, type TriggerConditionType } from '@/types/engine'
import { commentConditionFields } from './CommentTriggerSchema'

/**
 * criteria Threshold(みくじ箱のアイテムごとの条件)
 * - 条件の名前は全体の triggerConditions(engine/trigger)のいずれか
 */
export const criteriaThresholdConditions = [
  'username',
  'access', // アクセスレベル(管理者権限など)
  'gift', // プレミアムモードで使えるので
  'syoken',
  'count',
  'comment', // 追加のコメント内容
  'expression', // 判定式 (例: <<lc>> > 20)
] as const satisfies readonly TriggerConditionType[]
export type CriteriaThresholdCondition = (typeof criteriaThresholdConditions)[number]

export const CriteriaThresholdSchema = z.object({
  conditions: z.array(z.enum(criteriaThresholdConditions)).catch([]),
  ...commentConditionFields('assets.mikuji.items.criteria'),
  syoken: normalizedArray(SyokenConditionValueSchema, 'assets.mikuji.items.criteria.syoken'),
  count: CountConditionSchema.catch(() => CountConditionSchema.parse({})),
})
export type CriteriaThresholdType = z.infer<typeof CriteriaThresholdSchema>
