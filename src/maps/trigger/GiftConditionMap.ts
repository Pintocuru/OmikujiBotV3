// src/maps/trigger/GiftConditionMap.ts
import { GiftCondition } from '@/types/trigger'

// Map定義
export const giftConditionMap: Record<GiftCondition, { label: string; description: string }> = {
  all: {
    label: '全て',
    description: 'メンバー加入を含む全てのギフト',
  },
  blue: {
    label: '200円未満',
    description: '200円未満の小額ギフト',
  },
  lightBlue: {
    label: '200-499円',
    description: '200円以上500円未満のギフト',
  },
  green: {
    label: '500-999円',
    description: '500円以上1000円未満のギフト',
  },
  yellow: {
    label: '1000-1999円',
    description: '1000円以上2000円未満のギフト',
  },
  orange: {
    label: '2000-4999円',
    description: '2000円以上5000円未満のギフト',
  },
  pink: {
    label: '5000-9999円',
    description: '5000円以上10000円未満のギフト',
  },
  red: {
    label: '10000円-19999円',
    description: '10000円以上20000円未満の高額ギフト',
  },
  purple: {
    label: '20000円以上',
    description: '20000円以上の超高額ギフト',
  },
  special: {
    label: 'その他のギフト（メンバーシップ等）',
    description: '金額区分ではない有料サービス（メンバーシップ・ステッカー・サブスクなど）',
  },
}
