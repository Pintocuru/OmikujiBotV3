// src/types/OmikujiData/events/ServiceTriggerSchema.ts
import { z } from 'zod'

/**
 * 比較条件の種類
 * - 値(value)を使わない: changed / increased / decreased / greaterThanPeak
 * - 値(value)が必要: lowerBound / upperBound / equal / loop
 */
export const serviceSimpleComparisons = ['changed', 'increased', 'decreased', 'greaterThanPeak'] as const
export const serviceValueComparisons = ['lowerBound', 'upperBound', 'equal', 'loop'] as const
export const serviceConditions = [...serviceSimpleComparisons, ...serviceValueComparisons] as const

export const ServiceComparisonConditionSchema = z.enum(serviceConditions).default('changed').catch('changed')

export type ServiceComparisonConditionType = z.infer<typeof ServiceComparisonConditionSchema>
export type ServiceValueComparisonType = (typeof serviceValueComparisons)[number]

/** 値(value)が必要な比較条件かどうか */
export const isServiceValueComparison = (comparison: string): comparison is ServiceValueComparisonType =>
  (serviceValueComparisons as readonly string[]).includes(comparison)

/**
 * ServiceConditionSchema
 * comparison によって value の有無が決まる(value が必要な条件で value が無いデータは作れない)
 */
export const ServiceConditionSchema = z.discriminatedUnion('comparison', [
  z.object({ comparison: z.enum(serviceSimpleComparisons) }),
  z.object({ comparison: z.enum(serviceValueComparisons), value: z.number().min(0) }),
])
export type ServiceConditionType = z.infer<typeof ServiceConditionSchema>

/** 初期値(条件が無い・読めないときは、変化したら発火) */
const defaultServiceCondition = (): ServiceConditionType => ({ comparison: 'changed' })

/**
 * 配信数値条件の種類
 */
export const serviceTriggerConditions = ['upVote', 'viewer', 'follower', 'elapsedMinutes'] as const

export const ServiceTriggerConditionSchema = z.enum(serviceTriggerConditions).default('upVote').catch('upVote')
export type ServiceTriggerConditionType = z.infer<typeof ServiceTriggerConditionSchema>

/**
 * ServiceTriggerSchema
 * condition ごとに、必要なフィールドだけを持つ(保存形式は従来と同じ)
 * - 先頭の upVote は、condition が無いデータの初期値
 */
export const ServiceTriggerSchema = z.discriminatedUnion('condition', [
  z.object({
    condition: z.literal('upVote').default('upVote'),
    upVote: ServiceConditionSchema.default(defaultServiceCondition),
  }),
  z.object({
    condition: z.literal('viewer'),
    viewer: ServiceConditionSchema.default(defaultServiceCondition),
  }),
  z.object({
    condition: z.literal('follower'),
    follower: z.literal(true).default(true), // フォロワーが増えたときに発火(設定値なし)
  }),
  z.object({
    condition: z.literal('elapsedMinutes'),
    elapsedMinutes: z.number().min(0).default(0), // 配信開始からの経過分
  }),
])

export type ServiceTriggerType = z.infer<typeof ServiceTriggerSchema>
