// src/maps/trigger/AccessConditionMap.ts
import { AccessConditionTrigger } from '@/types/trigger'

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
