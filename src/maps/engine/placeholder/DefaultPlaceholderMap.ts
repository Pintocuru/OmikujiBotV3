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
    short: '【同時接続数】',
  },
  upVote: {
    slot: 'event',
    label: serviceMetaConditionMap.upVote.label,
    short: '【高評価数】',
  },
  follower: {
    slot: 'event',
    label: serviceMetaConditionMap.follower.label,
    short: '【登録数】',
  },
  lc: {
    slot: 'comment',
    label: countUnitConditionMap.lc.label,
    short: '【配信コメント数】',
  },
  tc: {
    slot: 'comment',
    label: countUnitConditionMap.tc.label,
    short: '【個人総コメント数】',
  },
  commenter: {
    slot: 'event',
    label: 'コメントをしたユーザー数',
    short: '【コメント数】',
  },
  syoken: {
    slot: 'event',
    label: '初見さんの数',
    short: '【初見数】',
  },
  user: {
    slot: 'comment',
    label: 'コメントしたユーザー',
    short: '【ユーザー名】',
  },
  userId: {
    slot: 'comment',
    label: 'コメントしたユーザーID',
    short: '【ユーザーID】',
  },
  price: {
    slot: 'comment',
    label: 'ギフト金額',
    short: '【ギフト金額】',
  },
  giftCount: {
    slot: 'comment',
    label: 'ギフトの個数',
    short: '【メンバーギフト数】',
  },
}

/**
 * 省略形（短い）ラベル
 */
export const defaultPlaceholdersShortLabels: Record<DefaultPlaceholders, string> = Object.fromEntries(
  Object.entries(defaultPlaceholderMap).map(([k, v]) => [k, v.short])
) as Record<DefaultPlaceholders, string>
