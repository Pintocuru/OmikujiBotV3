// src/console/game/WordAlchemy/ai/validateResult.ts
// AI の出力の検証 (純粋関数)。通ったものだけをゲームが使う
import { potMap, type PotKey } from '../maps/WordAlchemyPotMap'
import { canonicalChar } from '../scripts/potRules'
import { NAME_FREE_CHARS, NAME_MAX_LENGTH } from '../scripts/wordAlchemyConstants'
import {
  ALCHEMY_CATEGORIES,
  ALCHEMY_PALETTE,
  type AlchemyCategory,
  type AlchemyColor,
  type AlchemyResult,
  type Rng,
} from './alchemyTypes'

export type ValidationResult = { ok: true; result: AlchemyResult } | { ok: false; reason: string }

/** コードフェンスを取り除き、JSON として読む。前後に余計な文があれば、最初の { から最後の } までを読む */
const parseJson = (raw: string): unknown => {
  const text = raw.replace(/```(?:json)?/gi, '').trim()
  try {
    return JSON.parse(text)
  } catch {
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    return start >= 0 && end > start ? JSON.parse(text.slice(start, end + 1)) : undefined
  }
}

const isFree = (char: string) => NAME_FREE_CHARS.includes(char)

/**
 * 名前が、材料の文字の範囲に収まっているか (鍋が許可する変換で同じになる文字は、同じ文字として数える)
 * - 材料の文字を、材料にある回数まで使える (並べ替え・結合)。足りない文字・多すぎる文字は不可
 * - 省略できない鍋では、材料の文字をすべて使う必要がある
 * - NAME_FREE_CHARS (・) は、材料になくても使える
 */
export const isWithinMaterials = (name: string, materials: readonly string[], pot: PotKey): boolean => {
  const pool = new Map<string, number>()
  for (const char of Array.from(materials.join('').normalize('NFC'))) {
    if (isFree(char)) continue
    const key = canonicalChar(pot, char)
    pool.set(key, (pool.get(key) ?? 0) + 1)
  }
  for (const char of Array.from(name.normalize('NFC'))) {
    if (isFree(char)) continue
    const key = canonicalChar(pot, char)
    const left = pool.get(key) ?? 0
    if (left <= 0) return false
    pool.set(key, left - 1)
  }
  return potMap[pot].omit || [...pool.values()].every((left) => left === 0)
}

export const validateResult = (
  raw: string,
  materials: readonly string[],
  pot: PotKey,
  rng: Rng = Math.random
): ValidationResult => {
  let data: unknown
  try {
    data = parseJson(raw)
  } catch {
    return { ok: false, reason: 'JSON として読めない' }
  }
  if (typeof data !== 'object' || data === null) return { ok: false, reason: 'JSON として読めない' }
  const { c, k, n } = data as Record<string, unknown>

  if (!ALCHEMY_CATEGORIES.includes(c as AlchemyCategory)) return { ok: false, reason: '分類が A〜D ではない' }
  if (typeof n !== 'string') return { ok: false, reason: '名前がない' }
  const name = n.normalize('NFC')
  if (name === '') return { ok: false, reason: '名前が空' }
  // 長さの上限は、省略できる鍋だけ (すべて使う鍋の長さは、材料で決まる。3 つで最大 15 文字になり、上限を超えうる)
  if (potMap[pot].omit && Array.from(name).length > NAME_MAX_LENGTH) return { ok: false, reason: '名前が長すぎる' }
  if (!isWithinMaterials(name, materials, pot)) return { ok: false, reason: '名前が材料の文字の範囲に収まっていない' }

  // パレット外の色は、失敗にせず、ランダムで置き換える
  const color = ALCHEMY_PALETTE.includes(k as AlchemyColor)
    ? (k as AlchemyColor)
    : ALCHEMY_PALETTE[Math.floor(rng() * ALCHEMY_PALETTE.length)]
  return { ok: true, result: { c: c as AlchemyCategory, k: color, n: name } }
}
