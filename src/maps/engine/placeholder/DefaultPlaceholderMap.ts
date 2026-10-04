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
  winner: {
    slot: 'event',
    label: 'コメントをしたランダムなユーザー',
    short: 'Winner_Name',
  },
  winnerId: {
    slot: 'event',
    label: 'コメントをしたランダムなユーザーID',
    short: 'test_userId',
  },
  clock: {
    slot: 'event',
    label: '現在時刻',
    short: 'Clock_Time',
  },
  user: {
    slot: 'comment',
    label: 'コメントしたユーザー',
    short: 'User_Name',
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
  tc: {
    slot: 'comment',
    label: countUnitConditionMap.tc.label,
    short: 'TotalComment_Count',
  },
  draws: {
    slot: 'comment',
    label: countUnitConditionMap.draws.label,
    short: 'Omikuji_Draws_Count',
  },
}
