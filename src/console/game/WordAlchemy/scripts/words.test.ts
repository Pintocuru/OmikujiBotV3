// src/console/game/WordAlchemy/scripts/words.test.ts
import { describe, expect, it } from 'vitest'
import { isJunkWord, splitWords } from './words'
import { WORD_MAX_PER_COMMENT } from './wordAlchemyConstants'

describe('isJunkWord', () => {
  it('伸ばし棒・記号・絵文字・数字だけ (混ざっていてもよい) は弾く', () => {
    for (const text of [
      'ーーーーー',
      '？？？？？',
      '!?!?!',
      '〜〜〜',
      '12345',
      '１２３',
      '😀😀😀',
      '👍🏽👍🏽',
      '12:30!',
      'ー',
    ]) {
      expect(isJunkWord(text), text).toBe(true)
    }
  })
  it('2 文字以上の同じ文字の繰り返しは弾く (全角・大小文字は同じ文字)', () => {
    for (const text of ['wwwww', 'ｗｗｗｗｗ', 'wWwWw', 'ああああ', '草草草草草', 'ww']) {
      expect(isJunkWord(text), text).toBe(true)
    }
  })
  it('文字が混ざっていれば残す。1 文字だけの文字や、記号が混ざったことばも残す', () => {
    for (const text of ['すごいww', 'ラーメン', 'a1', 'ねえ？', 'ね', 'abcde', 'こんにちは']) {
      expect(isJunkWord(text), text).toBe(false)
    }
  })
})

describe('splitWords', () => {
  it('5 文字ずつに分ける (空白は除く)', () => {
    expect(splitWords('こんにちは 世界のみなさん')).toEqual(['こんにちは', '世界のみな', 'さん'])
  })
  it('弾いたことばは数えず、残りの先頭から上限まで', () => {
    expect(splitWords('wwwwwwwwwwこんにちは')).toEqual(['こんにちは'])
    const many = Array.from({ length: 10 }, (_, i) => `あいうえ${String.fromCharCode(0x30a2 + i)}`).join('')
    expect(splitWords(`wwwww${many}`)).toHaveLength(WORD_MAX_PER_COMMENT)
  })
  it('本文がなければ・すべて弾かれれば空', () => {
    expect(splitWords('')).toEqual([])
    expect(splitWords('   ')).toEqual([])
    expect(splitWords('？？？？？ーーーーー11111')).toEqual([])
  })
})
