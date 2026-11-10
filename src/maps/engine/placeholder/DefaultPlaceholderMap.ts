// src/maps/engine/placeholder/DefaultPlaceholderMap.ts
import type { DefaultPlaceholders } from '@/types/engine'
import { countUnitConditionMap } from '@/maps/engine/trigger/CountConditionMap'
import { serviceMetaConditionMap } from '@/maps/engine/trigger/ServiceConditionMap'

type DefaultPlaceholderDefinition = {
  slot: 'comment' | 'event'
  label: string
  short: string
}

export const defaultPlaceholderMap: Record<DefaultPlaceholders, DefaultPlaceholderDefinition> = {
  viewer: {
    slot: 'event',
    label: serviceMetaConditionMap.viewer.label,
    short: 'Viewer_Count',
  },
  upVote: {
    slot: 'event',
    label: serviceMetaConditionMap.upVote.label,
    short: 'UpVote_Count',
  },
  follower: {
    slot: 'event',
    label: serviceMetaConditionMap.follower.label,
    short: 'Subscribe_Count',
  },
  lc: {
    slot: 'comment',
    label: countUnitConditionMap.lc.label,
    short: 'LiveComment_Count',
  },
  commenter: {
    slot: 'event',
    label: 'コメントをしたユーザー数',
    short: 'Commenter_Count',
  },
  syoken: {
    slot: 'event',
    label: '初見さんの数',
    short: 'Syoken_Count',
  },
  user: {
    slot: 'comment',
    label: 'コメントしたユーザー',
    short: '【ユーザー名】',
  },
  userId: {
    slot: 'comment',
    label: 'コメントしたユーザーID',
    short: 'test_userId',
  },
  price: {
    slot: 'comment',
    label: 'ギフト金額',
    short: 'Gift_Price',
  },
  giftCount: {
    slot: 'comment',
    label: 'ギフトの個数',
    short: 'Gift_Count',
  },
  tc: {
    slot: 'comment',
    label: countUnitConditionMap.tc.label,
    short: 'TotalComment_Count',
  },
}

/**
 * 省略形（短い）ラベル
 */
export const defaultPlaceholdersShortLabels: Record<DefaultPlaceholders, string> = Object.fromEntries(
  Object.entries(defaultPlaceholderMap).map(([k, v]) => [k, v.short])
) as Record<DefaultPlaceholders, string>
