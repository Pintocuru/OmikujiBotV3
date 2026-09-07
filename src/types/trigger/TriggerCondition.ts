// shared/types/trigger/TriggerCondition.ts
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

// Map定義
export const triggerConditionMap: Record<TriggerCondition, { label: string; description: string }> = {
  comment: {
    label: 'チャットワード',
    description: 'チャットに含まれるキーワードで判定します',
  },
  syoken: {
    label: '初見判定ちゃん',
    description: '初見ユーザー、配信の1回目コメントを判定します',
  },
  access: {
    label: 'ユーザーの役職',
    description: '配信者・モデレーター等を判定します',
  },
  gift: {
    label: 'ギフト',
    description: 'ギフトの種類や金額で判定します',
  },
  count: {
    label: 'チャット数',
    description: '配信枠や個人ごとのコメント数で判定します',
  },
  service: {
    label: '配信プラットフォーム',
    description: '配信サイトで判定します',
  },
  userId: {
    label: 'ユーザーID',
    description: '特定のユーザーIDで判定します',
  },
  username: {
    label: 'ユーザー名',
    description: '特定のユーザー名で判定します',
  },
  timeRange: {
    label: '時間帯',
    description: '特定の時間帯で判定します',
  },
}
