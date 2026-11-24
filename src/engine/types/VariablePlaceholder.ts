// src/engine/types/VariablePlaceholder.ts
import { ExpressionEngine } from '../VariablePlaceholder/ExpressionEngine'

export interface PlaceholderVariableType {
  getEvaluator(): ExpressionEngine
  clear(): void
  delete(key: string): boolean
}

/**
 * スクリプト実行中の変数状態を保持するコンテキスト
 * セッション単位で利用する
 */
export class PlaceholderVariable implements PlaceholderVariableType {
  private readonly evaluator = new ExpressionEngine()

  getEvaluator(): ExpressionEngine {
    return this.evaluator
  }


  clear(): void {
    this.evaluator.clear()
  }

  delete(key: string): boolean {
    return this.evaluator.delete(key)
  }
}
