// src/ui/comment/UserComment/scripts/userCommentName.ts
import type { UserCommentNameMode } from '@/types/ui'

export const ANONYMOUS_NAME = '名無しさん'

/**
 * userId から、同じユーザーなら常に同じになる短い ID を作る(FNV-1a)。
 * 2ch の「ID:xxxxxxx」のように、名前を伏せても同じ人だと分かるために使う。
 */
export function anonymousId(userId: string): string {
  let hash = 0x811c9dc5
  for (let i = 0; i < userId.length; i++) {
    hash ^= userId.charCodeAt(i)
    hash = Math.imul(hash, 0x01000193)
  }
  return (hash >>> 0).toString(36).padStart(7, '0')
}

/** 表示する名前を決める */
export function resolveCommentName(user: { userName: string; userId: string }, mode: UserCommentNameMode): string {
  if (mode === 'anonymous') return `${ANONYMOUS_NAME} ID:${anonymousId(user.userId)}`
  return user.userName || ANONYMOUS_NAME
}
