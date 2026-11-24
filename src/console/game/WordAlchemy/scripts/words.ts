// src/console/game/WordAlchemy/scripts/words.ts
// コメントを「ことば」に分ける (純粋関数)
import { WORD_CHARS_PER_ITEM, WORD_MAX_PER_COMMENT } from './wordAlchemyConstants'

/** 空白を除いて、WORD_CHARS_PER_ITEM 文字ずつに分ける (最大 WORD_MAX_PER_COMMENT 個)。本文がなければ空 */
export const splitWords = (comment: string): string[] => {
  const chars = Array.from(comment.replace(/\s+/g, ''))
  const count = Math.min(WORD_MAX_PER_COMMENT, Math.ceil(chars.length / WORD_CHARS_PER_ITEM))
  return Array.from({ length: count }, (_, i) =>
    chars.slice(i * WORD_CHARS_PER_ITEM, (i + 1) * WORD_CHARS_PER_ITEM).join('')
  )
}
