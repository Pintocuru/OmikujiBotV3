// src/maps/engine/trigger/ServiceConditionMap.ts
import { DisplayMeta } from '@/editor/types/DisplayMeta'
import { ServiceMetaCondition } from '@/types/engine/trigger'

// Map定義
export const serviceMetaConditionMap: Record<ServiceMetaCondition, DisplayMeta> = {
  viewer: {
    label: '現在の枠の視聴ユーザー数',
    description: '現在の配信枠を視聴しているユーザー数で判定します',
  },
  upVote: {
    label: '現在の枠の高評価数',
    description: '現在の配信枠についた高評価数で判定します',
  },
  follower: {
    label: 'チャンネルの登録者数',
    description: 'チャンネルに登録されているユーザー数で判定します',
  },
}
