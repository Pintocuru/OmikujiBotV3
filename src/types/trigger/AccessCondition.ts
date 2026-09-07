// shared/types/trigger/AccessConditionTrigger.ts
import { z } from 'zod'

/**
 * アクセス権限条件の種類
 */
export const accessConditions = ['basic', 'member', 'moderator', 'owner', 'anonymous'] as const

// スキーマと型の定義
export const AccessConditionSchema = z.enum(accessConditions).default('basic').catch('basic')
export type AccessConditionTrigger = z.infer<typeof AccessConditionSchema>

// Map定義
export const accessConditionMap: Record<AccessConditionTrigger, { label: string; description: string }> = {
  basic: {
    label: '一般ユーザー',
    description: '以下どれにも該当しないユーザー',
  },
  member: {
    label: '有料メンバー',
    description: 'Youtube等のメンバーシップ',
  },
  moderator: {
    label: 'モデレーター',
    description: 'モデレーターの権限を持つユーザー',
  },
  owner: {
    label: '配信者',
    description: '配信者本人',
  },
  anonymous: {
    label: '匿名ユーザー',
    description: '匿名ユーザー',
  },
}
