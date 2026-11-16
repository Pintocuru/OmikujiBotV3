// src/maps/engine/placeholder/DefaultPlaceholderMap.ts
import type { DefaultPlaceholders } from '@/types/engine'

/**
 * デフォルトプレースホルダーの利用可能スロット
 */
export const defaultPlaceholderMap: Record<DefaultPlaceholders, 'comment' | 'event'> = {
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
