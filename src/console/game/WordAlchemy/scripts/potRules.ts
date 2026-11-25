// src/console/game/WordAlchemy/scripts/potRules.ts
// 鍋の規則 (純粋関数): ことばを受け付けるか / 文字を同じものとして扱う変換
import { potMap, type PotKey, type PotRejectKind } from '../maps/WordAlchemyPotMap'

const REJECT_TESTS: Readonly<Record<PotRejectKind, RegExp>> = {
  digitsOnly: /^\p{N}+$/u,
  /** 文字も数字もない (記号・絵文字だけ) */
  symbolsOnly: /^[^\p{L}\p{N}]+$/u,
}

/** 鍋がことばを受け付けるか (ゲーム側の決定的な判定。AI は関係しない) */
export const acceptsWord = (pot: PotKey, word: string): boolean =>
  !potMap[pot].rejects.some((kind) => REJECT_TESTS[kind].test(word))

/** 清音にする (が→か、ぱ→は)。かな以外は変えない */
const stripVoicing = (c: string): string =>
  /[\u3040-\u30ff]/.test(c)
    ? c
        .normalize('NFD')
        .replace(/[\u3099\u309a]/g, '')
        .normalize('NFC')
    : c

/** 鍋が許可する変換で同じになる文字を、同じ文字にそろえる (同値クラスの代表) */
export const canonicalChar = (pot: PotKey, char: string): string => {
  const { kana, dakuten } = potMap[pot]
  let c = char.normalize('NFC')
  // カタカナ → ひらがな (ァ〜ヶ。ー・ヽヾ は対象外)
  if (kana && /[\u30a1-\u30f6]/.test(c)) c = String.fromCharCode(c.charCodeAt(0) - 0x60)
  if (dakuten) c = stripVoicing(c)
  return c
}
