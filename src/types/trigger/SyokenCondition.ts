// shared/types/Threshold/SyokenCondition.ts
import { z } from 'zod'

/**
 * 初見条件の種類
 */
export const syokenConditions = ['syoken', 'again', 'firstVisit'] as const

// スキーマと型の定義
export const SyokenConditionSchema = z.enum(syokenConditions).default('syoken').catch('syoken')
export type SyokenCondition = z.infer<typeof SyokenConditionSchema>

// Map定義
export const syokenConditionMap: Record<SyokenCondition, { label: string; description: string }> = {
  syoken: {
    label: '初見',
    description: '初回訪問(わんコメにデータのない)ユーザー',
  },
  again: {
    label: '7日以上経過',
    description: '前回の訪問から7日以上経過したユーザー',
  },
  firstVisit: {
    label: '配信枠での初回',
    description: 'この配信枠で初めてコメントするユーザー',
  },
}
