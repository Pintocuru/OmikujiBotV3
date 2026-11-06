// src/generator/scripts/trigger/checkers/compilePattern.ts

const cache = new Map<string, RegExp | null>()

/**
 * 正規表現を作る(同じパターンは使い回す)
 * 不正なパターンは null を返す。コメントのたびに警告が出続けないよう、警告は1回だけ。
 * (g / y フラグは付けないこと。lastIndex の状態を持つため、使い回すと結果が変わる)
 */
export function compilePattern(pattern: string, flags = ''): RegExp | null {
  const key = `${flags}/${pattern}`
  const cached = cache.get(key)
  if (cached !== undefined) return cached

  let regex: RegExp | null
  try {
    regex = new RegExp(pattern, flags)
  } catch (e) {
    console.warn(`Invalid regex pattern: ${pattern}`, e)
    regex = null
  }
  cache.set(key, regex)
  return regex
}
