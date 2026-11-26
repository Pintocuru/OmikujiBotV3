// src/console/game/WordAlchemy/scripts/words.ts
// コメントを「ことば」に分ける (純粋関数)。素材として価値の低いことばは弾く
import { WORD_CHARS_PER_ITEM, WORD_MAX_PER_COMMENT } from './wordAlchemyConstants'

/** 記号・絵文字・伸ばし棒・数字だけで作れる文字 (空白は分ける前に取り除く) */
const NOISE_CHARS =
  /^[\p{P}\p{S}\p{N}\p{Extended_Pictographic}\p{Emoji_Modifier}\p{Regional_Indicator}\u200D\uFE0F\u20E3ーｰ]+$/u

/**
 * 素材として価値の低いことばか。次のどれかなら弾く
 * - 記号・絵文字・伸ばし棒(ー)・数字だけ (「？？？？？」「ーーーーー」「12345」「!?!?!」など。混ざっていてもよい)
 * - 2 文字以上で、同じ文字だけの繰り返し (「wwwww」「ああああ」「草草草草草」。全角・半角・大小文字は同じ文字として見る)
 */
export const isJunkWord = (text: string): boolean => {
  const chars = Array.from(text.normalize('NFKC').toLowerCase())
  if (chars.length === 0) return true
  if (NOISE_CHARS.test(text)) return true
  return chars.length >= 2 && new Set(chars).size === 1
}

/**
 * 空白を除いて、WORD_CHARS_PER_ITEM 文字ずつに分ける。isJunkWord のことばは捨て、残りの先頭から最大 WORD_MAX_PER_COMMENT 個。
 * 本文がなければ (捨てた結果、残らなければ) 空
 */
export const splitWords = (comment: string): string[] => {
  const chars = Array.from(comment.replace(/\s+/g, ''))
  const words: string[] = []
  for (let i = 0; i < chars.length && words.length < WORD_MAX_PER_COMMENT; i += WORD_CHARS_PER_ITEM) {
    const word = chars.slice(i, i + WORD_CHARS_PER_ITEM).join('')
    if (!isJunkWord(word)) words.push(word)
  }
  return words
}
