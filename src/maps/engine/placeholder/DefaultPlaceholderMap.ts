// src/maps/engine/placeholder/DefaultPlaceholderMap.ts
import type { DefaultPlaceholders } from '@/types/engine'

type DefaultPlaceholderDefinition = {
  slot: 'comment' | 'event'
  labelKey: string
  shortKey: string
}

export const defaultPlaceholderMap: Record<DefaultPlaceholders, DefaultPlaceholderDefinition> = {
  viewer: { slot: 'event', labelKey: 'mapText.defaultPlaceholder.viewer.label', shortKey: 'mapText.defaultPlaceholder.viewer.short' },
  upVote: { slot: 'event', labelKey: 'mapText.defaultPlaceholder.upVote.label', shortKey: 'mapText.defaultPlaceholder.upVote.short' },
  follower: { slot: 'event', labelKey: 'mapText.defaultPlaceholder.follower.label', shortKey: 'mapText.defaultPlaceholder.follower.short' },
  lc: { slot: 'comment', labelKey: 'mapText.defaultPlaceholder.lc.label', shortKey: 'mapText.defaultPlaceholder.lc.short' },
  tc: { slot: 'comment', labelKey: 'mapText.defaultPlaceholder.tc.label', shortKey: 'mapText.defaultPlaceholder.tc.short' },
  commenter: { slot: 'event', labelKey: 'mapText.defaultPlaceholder.commenter.label', shortKey: 'mapText.defaultPlaceholder.commenter.short' },
  syoken: { slot: 'event', labelKey: 'mapText.defaultPlaceholder.syoken.label', shortKey: 'mapText.defaultPlaceholder.syoken.short' },
  user: { slot: 'comment', labelKey: 'mapText.defaultPlaceholder.user.label', shortKey: 'mapText.defaultPlaceholder.user.short' },
  userId: { slot: 'comment', labelKey: 'mapText.defaultPlaceholder.userId.label', shortKey: 'mapText.defaultPlaceholder.userId.short' },
  price: { slot: 'comment', labelKey: 'mapText.defaultPlaceholder.price.label', shortKey: 'mapText.defaultPlaceholder.price.short' },
  giftCount: { slot: 'comment', labelKey: 'mapText.defaultPlaceholder.giftCount.label', shortKey: 'mapText.defaultPlaceholder.giftCount.short' },
}

/**
 * 短縮ラベルを現在の言語で取得
 */
export const getDefaultPlaceholdersShortLabels = (translate: (key: string) => string): Record<DefaultPlaceholders, string> =>
  Object.fromEntries(
    Object.entries(defaultPlaceholderMap).map(([key, meta]) => [key, translate(meta.shortKey)])
  ) as Record<DefaultPlaceholders, string>
