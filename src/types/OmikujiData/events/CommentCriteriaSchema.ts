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
/** 保存データの conditions(string[])から、この版で扱える条件かどうかを判定する */
export const isCriteriaThresholdCondition = (value: string): value is CriteriaThresholdCondition =>
  (criteriaThresholdConditions as readonly string[]).includes(value)

export const CriteriaThresholdSchema = z.object({
  // 未知の条件も文字列のまま残す(判定側 checkAllTriggers が「満たさない」扱いにする)。
  // enum にすると、1つ未知の値があるだけで配列ごと [] になり、全員に発火してしまう
  conditions: z.array(z.string()).catch([]),
  ...commentConditionFields('assets.mikuji.items.criteria'),
  syoken: normalizedArray(SyokenConditionValueSchema, 'assets.mikuji.items.criteria.syoken'),
  count: CountConditionSchema.catch(() => CountConditionSchema.parse({})),
})
export type CriteriaThresholdType = z.infer<typeof CriteriaThresholdSchema>
