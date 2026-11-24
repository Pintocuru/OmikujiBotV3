// src/console/game/WordAlchemy/ai/mockAlchemy.ts
// 規則ベースの Mock (純粋関数)。AI を使えないとき (キー未設定・エラー・上限超過) の代替で、キーなしでも通して遊べる
// 鍋の規則で、材料の文字を並べ替え・省略・変換して名前を作り、分類と色はランダムにする。結果は検証を通る
import { potMap, type PotKey } from '../maps/WordAlchemyPotMap'
import { NAME_FREE_CHARS, NAME_MAX_LENGTH } from '../scripts/wordAlchemyConstants'
import { ALCHEMY_CATEGORIES, ALCHEMY_PALETTE, type AlchemyResult, type Rng } from './alchemyTypes'

const pick = <T>(list: readonly T[], rng: Rng): T => list[Math.floor(rng() * list.length)]

const shuffle = <T>(list: readonly T[], rng: Rng): T[] => {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/** ひらがな ↔ カタカナを入れ替える */
const toggleKana = (c: string): string => {
  const code = c.charCodeAt(0)
  if (c.length === 1 && code >= 0x3041 && code <= 0x3096) return String.fromCharCode(code + 0x60)
  if (c.length === 1 && code >= 0x30a1 && code <= 0x30f6) return String.fromCharCode(code - 0x60)
  return c
}

/** 清音 ↔ 濁音・半濁音を入れ替える (が→か、か→が)。濁点が付かない文字は、そのまま */
const toggleVoicing = (c: string): string => {
  const decomposed = c.normalize('NFD')
  if (/[\u3040-\u30ff]/.test(c) && /[\u3099\u309a]/.test(decomposed)) return decomposed.replace(/[\u3099\u309a]/g, '').normalize('NFC')
  const voiced = (c + '\u3099').normalize('NFC')
  return Array.from(voiced).length === 1 ? voiced : c
}

export const mockAlchemy = (materials: readonly string[], pot: PotKey, rng: Rng = Math.random): AlchemyResult => {
  const { short, kana, dakuten } = potMap[pot]
  // 材料の文字 (許可リストの記号は、数えない)
  let chars = Array.from(materials.join('').normalize('NFC')).filter((c) => !NAME_FREE_CHARS.includes(c))
  chars = shuffle(chars, rng)
  // 材料の文字を一部だけ使う。短くまとめる鍋は半分ほどに、ほかの鍋は半分〜上限までの長さにする (上限は NAME_MAX_LENGTH)
  const min = Math.max(1, Math.ceil(chars.length / 2))
  const max = Math.max(min, Math.min(NAME_MAX_LENGTH, chars.length))
  chars = chars.slice(0, Math.min(NAME_MAX_LENGTH, short ? min : min + Math.floor(rng() * (max - min + 1))))
  const name = chars
    .map((c) => {
      let out = c
      if (kana && rng() < 0.5) out = toggleKana(out)
      if (dakuten && rng() < 0.5) out = toggleVoicing(out)
      return out
    })
    .join('')
  return { c: pick(ALCHEMY_CATEGORIES, rng), k: pick(ALCHEMY_PALETTE, rng), n: name }
}
