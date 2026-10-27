// src/generator/scripts/trigger/checkers/ExpressionEvaluator.ts
import { Parser } from 'expr-eval-fork'

/**
 * 判定式に渡す変数 (値は式の文字列に埋め込まず、評価コンテキストとして渡す)
 */
export type TriggerExpressionContext = Record<string, string | number>

// <<name>> → name (値ではなく変数名への置換。値の埋め込みはしない)
const PLACEHOLDER_PATTERN = /<<\s*([A-Za-z_][A-Za-z0-9_]*)\s*>>/g
const STRING_LITERAL_PATTERN = /'[^']*'|"[^"]*"/g
const IDENTIFIER_CHAR = /[A-Za-z0-9_]/
// 変数名の一部に埋め込んでよい値 (式の構文を変えられない文字だけ。sanitizeKey の出力はこれに該当)
const SAFE_NAME_FRAGMENT = /^[A-Za-z0-9_]+$/

// 判定に使える関数 (rand / random など結果が変わるものは含めない)
const ALLOWED_FUNCTIONS = ['min', 'max', 'pow', 'if', 'roundTo', 'hypot'] as const

/**
 * 判定専用パーサー。
 * ExpressionEngine とは別物で、代入・関数定義・乱数は使えない (読み取り専用)。
 */
function createParser(): Parser {
  const parser = new Parser({
    allowMemberAccess: false,
    operators: {
      // 使うもの
      add: true,
      subtract: true,
      multiply: true,
      divide: true,
      remainder: true,
      power: true,
      concatenate: true,
      conditional: true,
      comparison: true,
      logical: true,
      abs: true,
      ceil: true,
      floor: true,
      round: true,
      trunc: true,
      sqrt: true,
      length: true,
      min: true,
      max: true,
      // 使わないもの
      assignment: false,
      fndef: false,
      in: false,
      random: false,
      factorial: false,
      sin: false,
      cos: false,
      tan: false,
      asin: false,
      acos: false,
      atan: false,
      sinh: false,
      cosh: false,
      tanh: false,
      asinh: false,
      acosh: false,
      atanh: false,
      log: false,
      ln: false,
      lg: false,
      log10: false,
      log2: false,
      log1p: false,
      exp: false,
      expm1: false,
      cbrt: false,
      sign: false,
    },
  })

  const original = parser.functions as Record<string, unknown>
  const functions: Record<string, unknown> = {}
  for (const name of ALLOWED_FUNCTIONS) {
    if (name in original) functions[name] = original[name]
  }
  // ExpressionEngine と同じ意味の型変換関数
  functions.str = (...args: unknown[]) => args.map((v) => String(v)).join('')
  functions.num = (v: unknown) => {
    const n = Number(v)
    return isNaN(n) ? 0 : n
  }
  functions.bool = (v: unknown) => (Number(v) !== 0 ? 1 : 0)
  parser.functions = functions

  return parser
}

const parser = createParser()

// 同じ式の警告をコメントごとに出し続けないための記録
const warnedExpressions = new Set<string>()

function warnOnce(expression: string, reason: unknown): void {
  if (warnedExpressions.has(expression)) return
  warnedExpressions.add(expression)
  console.warn(`判定式を評価できないため false として扱います: "${expression}"`, reason)
}

/**
 * <<name>> を式として評価できる形に置き換える。評価できない形なら null。
 * - 単独の <<name>> は name (変数名) に置換する。値は式に埋め込まず scope から解決する
 * - 変数名の一部になっている <<name>> (例: SyokenSagi<<userId>>) は、context の値で置換して変数名を組み立てる。
 *   値が [A-Za-z0-9_] だけで構成されていないとき (ユーザー名など) や context にないときは評価できない扱い
 */
function normalizeTriggerExpression(expression: string, context?: TriggerExpressionContext): string | null {
  let unresolved = false

  const replaced = expression
    .replace(PLACEHOLDER_PATTERN, (match: string, name: string, offset: number, whole: string) => {
      const before = whole.slice(0, offset)
      const after = whole.slice(offset + match.length)
      const embedded =
        IDENTIFIER_CHAR.test(before.slice(-1)) ||
        IDENTIFIER_CHAR.test(after.slice(0, 1)) ||
        before.endsWith('>>') ||
        after.startsWith('<<')

      if (!embedded) return name

      const value = context && Object.hasOwn(context, name) ? String(context[name]) : undefined
      if (value === undefined || !SAFE_NAME_FRAGMENT.test(value)) {
        unresolved = true
        return match
      }
      return value
    })
    .trim()

  if (unresolved || !replaced) return null

  // 変数名にならなかった << >> (インラインランダム構文など) は判定式として扱わない
  if (replaced.includes('<<') || replaced.includes('>>')) return null

  // 文字列リテラルの外の ; は複数式の区切りになり、最後の式だけが結果になってしまうため認めない
  if (replaced.replace(STRING_LITERAL_PATTERN, '').includes(';')) return null

  return replaced
}

/**
 * 判定式を評価する。
 * - 結果が true (比較式・論理式が成立) のときだけ true
 * - 空の式、構文エラー、評価エラー、true 以外の結果 (数値・文字列など) はすべて false
 * - 未定義の変数は 0 として扱う (ExpressionEngine と同じ)
 * - 変数名に埋め込んだ <<userId>> などは値で置き換えてから評価する (normalizeTriggerExpression 参照)
 */
export function evaluateTriggerExpression(expression: string | undefined, context: TriggerExpressionContext): boolean {
  if (!expression) return false

  try {
    const normalized = normalizeTriggerExpression(expression, context)
    if (normalized === null) {
      warnOnce(expression, '式が空、または使えない記法を含んでいます')
      return false
    }

    const expr = parser.parse(normalized)

    const scope: Record<string, string | number> = { ...context }
    for (const name of expr.variables()) {
      if (!Object.hasOwn(scope, name)) scope[name] = 0
    }

    return expr.evaluate(scope) === true
  } catch (error) {
    warnOnce(expression, error)
    return false
  }
}
