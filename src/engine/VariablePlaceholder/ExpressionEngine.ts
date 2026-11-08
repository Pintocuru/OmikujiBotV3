// src/engine/VariablePlaceholder/ExpressionEngine.ts
import { KeyValueMap } from '@/engine/KeyValue/KeyValueMap'
import { Parser } from 'expr-eval-fork'

const MAX_VALUE = 999999999
const MIN_VALUE = -999999999

// 代入(=, +=, -=, *=, /=)の判定。比較演算子 == は代入として扱わない
const ASSIGNMENT_PATTERN = /[a-zA-Z_][a-zA-Z0-9_]*\s*[\+\-\*\/]?=(?!=)/
const ASSIGNMENT_HEAD_PATTERN = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*[\+\-\*\/]?=(?!=)/
// 複合代入 (+=, -=, *=, /=)。expr-eval は対応していないので、評価の前に通常の代入へ書き換える
const COMPOUND_ASSIGNMENT_PATTERN = /^([a-zA-Z_][a-zA-Z0-9_]*)\s*([\+\-\*\/])=(?!=)\s*([\s\S]+)$/

/**
 * expr-eval-fork ベースの式評価エンジン
 */
export class ExpressionEngine extends KeyValueMap {
  private readonly parser: Parser

  constructor() {
    super()
    this.parser = new Parser({
      operators: {
        assignment: true,
        logical: true,
        comparison: true,
        in: false,
      },
    })

    // ホワイトリスト関数: rand
    this.parser.functions.rand = (min: number, max: number): number => {
      const lo = Math.min(min, max)
      const hi = Math.max(min, max)
      return Math.floor(Math.random() * (hi - lo + 1)) + lo
    }

    // str / num / bool
    this.parser.functions.str = (...args: any[]) => args.map((v) => String(v)).join('')

    this.parser.functions.num = (v: any) => {
      const n = Number(v)
      return isNaN(n) ? 0 : n
    }

    this.parser.functions.bool = (v: any) => {
      return Number(v) !== 0 ? 1 : 0
    }
  }

  /**
   * 式を評価してステートを更新し、結果を返す
   */
  evaluateExpression(expression: string): {
    output: string
    hasOutput: boolean
  } {
    const trimmed = expression.trim()

    // セミコロン区切りで複数式を処理
    const statements = trimmed
      .split(';')
      .map((s) => s.trim())
      .filter(Boolean)

    let lastResult: string | number | boolean = ''
    let hasAssignment = false

    for (const statement of statements) {
      const isAssignment = ASSIGNMENT_PATTERN.test(statement)
      if (isAssignment) hasAssignment = true

      const result = this.evaluateSingle(statement)
      lastResult = result
    }

    // 代入式はテキストに出力しない
    if (hasAssignment) {
      return { output: '', hasOutput: false }
    }

    return { output: String(lastResult), hasOutput: true }
  }

  /**
   * 単一の式を評価してステートを更新
   */
  private evaluateSingle(expression: string): string | number | boolean {
    const trimmed = this.expandCompoundAssignment(expression.trim())

    try {
      const context = this.buildContext()

      // 式中の未定義変数を事前に 0 で補完
      const expr = this.parser.parse(trimmed)
      for (const varName of expr.variables()) {
        if (!(varName in context)) {
          context[varName] = 0
        }
      }

      const result = expr.evaluate(context)

      // 代入式の場合、ステートを更新
      const assignMatch = trimmed.match(ASSIGNMENT_HEAD_PATTERN)
      if (assignMatch) {
        const varName = assignMatch[1]
        if (varName in context) {
          const newValue = context[varName]
          const clamped = this.clampIfNumber(newValue)
          this.set(varName, clamped)
        }
      }

      return result
    } catch (error) {
      throw new Error(`式の評価に失敗しました: "${trimmed}" - ${error}`)
    }
  }

  /**
   * 複合代入を通常の代入に書き換える: `x += a * 2` → `x = x + (a * 2)`
   * (右辺を括弧で囲むので、`x -= 1 + 1` も `x = x - (1 + 1)` として計算される)
   */
  private expandCompoundAssignment(statement: string): string {
    const match = statement.match(COMPOUND_ASSIGNMENT_PATTERN)
    if (!match) return statement

    const [, name, operator, right] = match
    return `${name} = ${name} ${operator} (${right.trim()})`
  }

  /**
   * 数値なら範囲クランプ・丸めを適用、文字列はそのまま返す
   */
  private clampIfNumber(value: string | number | boolean): string | number {
    if (typeof value === 'boolean') return value ? 1 : 0
    if (typeof value !== 'number') return value
    const rounded = Math.round(value * 100) / 100
    return Math.max(MIN_VALUE, Math.min(MAX_VALUE, rounded))
  }

  /**
   * 全変数を expr-eval-fork のコンテキストとして構築
   */
  private buildContext(): Record<string, string | number> {
    const context: Record<string, string | number> = {}
    for (const [key, value] of Object.entries(this.getAll())) {
      if (typeof value === 'number') {
        context[key] = value
      } else {
        const num = parseFloat(value)
        context[key] = isNaN(num) ? value : num
      }
    }
    return context
  }
}
