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

export const countComparisonConditionMap: Record<CountComparisonCondition, { label: string; description: string }> = {
  lowerBound: {
    label: '指定値以上',
    description: '指定値を下限として、現在の数値がそれ以上の時に条件を満たします',
  },
  upperBound: {
    label: '指定値以下',
    description: '指定値を上限として、現在の数値がそれ以下の時に条件を満たします',
  },
  equal: {
    label: '等しい',
    description: '設定値と等しい時に条件を満たします',
  },
  loop: {
    label: 'ループ',
    description: '設定値の倍数の時に条件を満たします',
  },
}

/**
 * unit
 */
export const countUnitConditions = ['lc', 'tc', 'draws'] as const

export const CountUnitConditionSchema = z.enum(countUnitConditions).default('draws').catch('draws')
export type CountUnitCondition = z.infer<typeof CountUnitConditionSchema>

export const countUnitConditionMap: Record<CountUnitCondition, { label: string; description: string }> = {
  lc: {
    label: '配信枠のコメント数',
    description: 'この配信枠でのコメント数で判定します',
  },
  tc: {
    label: '個人コメント数(総数)',
    description: '全配信を通じたユーザーの総コメント数で判定します',
  },
  draws: {
    label: 'おみくじの回数',
    description: '現在のおみくじルールの履歴から判定します',
  },
}

/**
 * Schema
 */
export const CountConditionSchema = z.object({
  comparison: CountComparisonConditionSchema,
  unit: CountUnitConditionSchema,
  value: z.number().min(0).default(1).catch(1),
})

export type CountConditionTriggerType = z.infer<typeof CountConditionSchema>
