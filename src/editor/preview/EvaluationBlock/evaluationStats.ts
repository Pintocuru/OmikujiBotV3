// src/editor/preview/EvaluationBlock/evaluationStats.ts

export type VarValue = string | number
export type VarEntry = [string, VarValue]

// 変数名として使える形(式の中で代入できる名前)
export const VARIABLE_NAME_PATTERN = /^[a-zA-Z_][a-zA-Z0-9_]*$/

// 「anygame_*」のように * を含む検索はワイルドカード検索として扱う
export const hasWildcard = (query: string): boolean => query.includes('*')

// * を「任意の文字列」として変数名に一致させる正規表現を作る
export function wildcardToRegExp(pattern: string): RegExp {
  const escaped = pattern
    .trim()
    .split('*')
    .map((part) => part.replace(/[.+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*')
  return new RegExp(`^${escaped}$`, 'i')
}

// 入力文字列を値に変換する(数値として読めれば数値、'すいか' のような引用符は外す)
export function parseVariableValue(raw: string): VarValue {
  const text = raw.trim()
  if (text !== '' && Number.isFinite(Number(text))) return Number(text)
  const quoted = text.match(/^(['"])(.*)\1$/)
  return quoted ? quoted[2] : text
}

type NumberSummary = {
  count: number
  sum: number
  avg: number
  min: number
  max: number
  ranking: { key: string; label: string; value: number }[] // 値の大きい順
}

type StringSummary = {
  count: number
  ranking: { value: string; count: number }[] // 多い順
}

type WildcardSummary = {
  matched: number
  numbers: NumberSummary | null
  strings: StringSummary | null
}

const round2 = (n: number) => Math.round(n * 100) / 100

/**
 * ワイルドカードに一致した変数を、数値(合計・平均・ランキング)と文字列(出現数ランキング)に分けて集計する
 * - label は、パターンの * より前の固定部分を除いた名前(anygame_* なら userId の部分)
 */
export function summarizeByPattern(entries: readonly VarEntry[], pattern: string, topN = 10): WildcardSummary {
  const regex = wildcardToRegExp(pattern)
  const prefixLength = pattern.trim().indexOf('*')
  const matched = entries.filter(([key]) => regex.test(key))

  const nums = matched.filter((e): e is [string, number] => typeof e[1] === 'number')
  const strs = matched.filter((e): e is [string, string] => typeof e[1] === 'string')

  let numbers: NumberSummary | null = null
  if (nums.length > 0) {
    const values = nums.map(([, v]) => v)
    const sum = values.reduce((a, b) => a + b, 0)
    numbers = {
      count: nums.length,
      sum: round2(sum),
      avg: round2(sum / nums.length),
      min: Math.min(...values),
      max: Math.max(...values),
      ranking: [...nums]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, topN)
        .map(([key, value]) => ({ key, label: key.slice(prefixLength) || key, value })),
    }
  }

  let strings: StringSummary | null = null
  if (strs.length > 0) {
    const counts = new Map<string, number>()
    for (const [, v] of strs) counts.set(v, (counts.get(v) ?? 0) + 1)
    strings = {
      count: strs.length,
      ranking: [...counts]
        .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
        .slice(0, topN)
        .map(([value, count]) => ({ value, count })),
    }
  }

  return { matched: matched.length, numbers, strings }
}
