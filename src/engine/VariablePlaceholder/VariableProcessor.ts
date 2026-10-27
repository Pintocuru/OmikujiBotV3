// src/engine/VariablePlaceholder/VariableProcessor.ts
import {
  BotMessageSlotsSchema,
  BotMessageSlotsType,
  VariablePlaceholderResult,
} from '@/types/generator'
import { PlaceholderVariableType } from '../types/VariablePlaceholder'
import { EXPRESSION_PATTERN, RESERVED_KEYS, VAR_REFERENCE_PATTERN } from './ReservedKeys'
import { ExpressionEngine } from './ExpressionEngine'

/**
 * 評価ブロック処理エンジン
 *   {{name = 'value'}}                文字列代入
 *   {{score = 100}}                   数値代入
 *   {{score += 10}}                   複合代入
 *   {{result = score >= 10 ? 1 : 0}}  三項演算子
 *   {{a = 1; b = 2}}                  複数式（セミコロン区切り）
 *   {{name}}                          変数参照（出力）
 */
export class VariablePlaceholderProcessor {
  constructor(private readonly context: PlaceholderVariableType) {}

  process(text: string): VariablePlaceholderResult {
    const evaluator = this.context.getEvaluator()

    // 専用のプリプロセッサでコメントと不要な改行を除去
    let processed = this.preprocess(text)
    processed = this.processExpressions(processed, evaluator) // 式評価
    processed = this.processVariableReferences(processed, evaluator) // 変数参照

    const allVars = Object.fromEntries(Object.entries(evaluator.getAll()).map(([k, v]) => [k, String(v)])) as Record<
      string,
      string
    >

    processed = this.processReservedPlaceholders(processed, evaluator)

    const extra = this.buildExtraData(allVars)
    for (const key of RESERVED_KEYS) evaluator.remove(key)

    const hasUnresolved = /\{\{[\s\S]*?\}\}/.test(processed)
    return {
      bubble: processed,
      extra: {
        slots: extra.slots,
      },
      hasError: hasUnresolved,
    }
  }

  /**
   * コード内のコメントを除去し、評価可能な 1 行の文字列に整形
   */
  private preprocess(text: string): string {
    return text
      .replace(/\/\*[\s\S]*?\*\//g, '') // ブロックコメント (/* ... */) を削除
      .replace(/\/\/.*/g, '') // 行コメント (// ...) を削除
      .replace(/\n/g, '') // 全ての改行を除去して 1 行に連結
      .trim() // 前後の余計な空白を削除
  }

  /**
   * 式評価
   */
  private processExpressions(text: string, evaluator: ExpressionEngine): string {
    return text.replace(EXPRESSION_PATTERN, (match, expression) => {
      try {
        const { output, hasOutput } = evaluator.evaluateExpression(expression.trim())
        return hasOutput ? output : ''
      } catch (error) {
        console.warn(`式の評価に失敗: ${match}`, error)
        return match
      }
    })
  }

  /**
   * 変数参照
   */
  private processVariableReferences(text: string, evaluator: ExpressionEngine): string {
    return text.replace(VAR_REFERENCE_PATTERN, (match, varName) => {
      if (evaluator.has(varName)) return String(evaluator.get(varName))
      console.warn(`未定義の変数: ${varName}`)
      return match
    })
  }

  /**
   * 評価ブロックの slot0〜slot9 を取り出す(editor のフォームで入れた slots を上書きする用)
   */
  private buildExtraData(vars: Record<string, string>): { slots?: BotMessageSlotsType } {
    const slotEntries: Record<string, string> = {}
    for (let i = 0; i <= 9; i++) {
      const key = `slot${i}`
      if (vars[key] !== undefined) slotEntries[key] = vars[key]
    }
    if (Object.keys(slotEntries).length === 0) return {}

    try {
      return { slots: BotMessageSlotsSchema.parse(slotEntries) }
    } catch (error) {
      console.warn('Extra data construction failed:', error)
      return {}
    }
  }

  /**
   * 予約語の置換
   */
  private processReservedPlaceholders(text: string, evaluator: ExpressionEngine): string {
    return text.replace(/\[\[\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\]\]/g, (match, key) => {
      if (RESERVED_KEYS.includes(key) && evaluator.has(key)) {
        return String(evaluator.get(key))
      }
      return match
    })
  }
}
