// src/maps/engine/placeholder/DefaultPlaceholderMap.ts
import { DefaultPlaceholders, defaultPlaceholderLabel } from '@/types/engine'

type DefaultPlaceholderSlot = 'comment' | 'event'

/**
 * デフォルトプレースホルダーの利用可能スロット
 */
export const defaultPlaceholderMap: Record<DefaultPlaceholders, DefaultPlaceholderSlot> = {
  viewer: 'event',
  upVote: 'event',
  follower: 'event',
  lc: 'comment',
  tc: 'comment',
  commenter: 'event',
  syoken: 'event',
  user: 'comment',
  userId: 'comment',
  price: 'comment',
  giftCount: 'comment',
}

/**
 * 短縮ラベルを現在の言語で取得
 */
export const getDefaultPlaceholdersShortLabels = (
  translate: (key: string) => string
): Record<DefaultPlaceholders, string> =>
  Object.fromEntries(
    defaultPlaceholderLabel.map((key) => [key, translate(`mapText.defaultPlaceholder.${key}.short`)])
  ) as Record<DefaultPlaceholders, string>
