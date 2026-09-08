//
import { SyokenCondition } from '@/types/trigger'

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
