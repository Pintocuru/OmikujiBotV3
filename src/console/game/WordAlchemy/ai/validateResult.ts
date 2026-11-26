// src/console/game/WordAlchemy/ai/validateResult.ts
// AI の出力の検証 (純粋関数)。通ったものだけをゲームが使う。
// 名前の文字・長さは検証しない (錬金術は不安定なので、材料にない文字が出ても、長くなってもよい)。見るのは JSON の形式・分類・色だけ
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

export const validateResult = (raw: string, rng: Rng = Math.random): ValidationResult => {
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
  const name = n.normalize('NFC').trim()
  if (name === '') return { ok: false, reason: '名前が空' }

  // パレット外の色は、失敗にせず、ランダムで置き換える
  const color = ALCHEMY_PALETTE.includes(k as AlchemyColor)
    ? (k as AlchemyColor)
    : ALCHEMY_PALETTE[Math.floor(rng() * ALCHEMY_PALETTE.length)]
  return { ok: true, result: { c: c as AlchemyCategory, k: color, n: name } }
}
