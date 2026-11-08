// src/engine/VariablePlaceholder/VariableProcessor.ts
import { PlaceholderVariableType } from '../types/VariablePlaceholder'

/**
 * 評価ブロック処理エンジン
 *
 * variable ステップの本文(式)を評価して、変数を更新する。本文に { } などの囲みは要らない。
 *   name = 'value'                文字列代入
 *   score = 100                   数値代入
 *   score = score + 10            四則演算
 *   result = score >= 10 ? 1 : 0  三項演算子
 *   a = 1; b = 2                  複数式(セミコロン区切り)
 *
 * 変数の値を本文に出すのはメッセージ側の [[name]] で、DisplayVariableResolver が担当する。
 */
export class VariablePlaceholderProcessor {
  constructor(private readonly context: PlaceholderVariableType) {}

  /**
   * 式を評価して変数を更新する。評価に失敗したら例外を投げる(呼び出し側で通知する)
   */
  run(code: string): void {
    const expression = this.preprocess(code)
    if (!expression) return

    this.context.getEvaluator().evaluateExpression(expression)
  }

  /**
   * コード内のコメントを除去し、評価可能な 1 行の文字列に整形
   * (改行は連結するだけなので、複数の式は ; で区切る)
   */
  private preprocess(code: string): string {
    return code
      .replace(/\/\*[\s\S]*?\*\//g, '') // ブロックコメント (/* ... */) を削除
      .replace(/\/\/.*/g, '') // 行コメント (// ...) を削除
      .replace(/\n/g, '') // 全ての改行を除去して 1 行に連結
      .trim() // 前後の余計な空白を削除
  }
}
