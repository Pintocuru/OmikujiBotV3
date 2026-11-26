// src/console/game/WordAlchemy/ai/mockAlchemy.ts
// 規則ベースの Mock (純粋関数)。AI を使えないとき (キー未設定・エラー・上限超過) の代替で、キーなしでも通して遊べる。
// 全鍋で同じ処理: 材料の文字を並べ替え・省略して名前を作り、分類と色はランダムにする (圧力鍋だけ、短くする)
import { potMap, type PotKey } from '../maps/WordAlchemyPotMap'
import { PRESSURE_POT_NAME_LENGTH } from '../scripts/wordAlchemyConstants'
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

export const mockAlchemy = (materials: readonly string[], pot: PotKey, rng: Rng = Math.random): AlchemyResult => {
  const chars = shuffle(Array.from(materials.join('').normalize('NFC')), rng)
  // 材料の文字を一部だけ使う。圧力鍋は半分ほど (最大 PRESSURE_POT_NAME_LENGTH 文字)、ほかの鍋は半分〜すべての長さにする
  const min = Math.max(1, Math.ceil(chars.length / 2))
  const length = potMap[pot].short
    ? Math.min(PRESSURE_POT_NAME_LENGTH, min)
    : min + Math.floor(rng() * (Math.max(min, chars.length) - min + 1))
  return { c: pick(ALCHEMY_CATEGORIES, rng), k: pick(ALCHEMY_PALETTE, rng), n: chars.slice(0, length).join('') }
}
