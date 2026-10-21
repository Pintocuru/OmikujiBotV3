// src/generator/scripts/trigger/checkers/ExpressionChecker.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import { useAppStore } from '@/generator/stores/useAppStore'
import { buildDefaultPlaceholders } from '@/generator/scripts/EventProcess/DefaultPlaceholderBuilder'
import { evaluateTriggerExpression, TriggerExpressionContext } from './ExpressionEvaluator'

// {{icon ID}} は本文表示用のマークアップなので、判定では取り除く (先頭のものだけ)
const LEADING_ICON_MARKUP = /^\{\{icon [^}]*\}\}/

/**
 * 判定式に渡す変数を組み立てる。すべて読み取りのみで、store には書き込まない。
 * 優先順位: 標準値 (lc, user など) > placeholderVariable (おみくじの式で作った変数)
 */
export function buildTriggerExpressionContext(omiken: OmikenCommentType): TriggerExpressionContext {
  const store = useAppStore()
  const context: TriggerExpressionContext = {}

  // 1. おみくじの式で作った変数 (ExpressionEngine と同様、数値として読める文字列は数値にする)
  for (const [key, value] of Object.entries(store.placeholderVariable.getAll())) {
    if (typeof value === 'number') {
      context[key] = value
    } else {
      const num = parseFloat(value)
      context[key] = isNaN(num) ? value : num
    }
  }

  // 2. 標準値 (本文の <<lc>> などと同じ値)
  for (const [key, value] of Object.entries(buildDefaultPlaceholders(store, omiken))) {
    context[key] = typeof value === 'string' ? value.replace(LEADING_ICON_MARKUP, '') : value
  }

  // 3. user / userName は表示名そのもの (アイコン用マークアップなし)
  context.user = omiken.userName
  context.userName = omiken.userName

  return context
}

/**
 * 判定式チェック。評価できない場合は例外を出さず false。
 */
export function checkExpression(omiken: OmikenCommentType, expression?: string): boolean {
  if (!expression?.trim()) return false

  try {
    return evaluateTriggerExpression(expression, buildTriggerExpressionContext(omiken))
  } catch (error) {
    console.warn('判定式の評価コンテキストを作れないため false として扱います', error)
    return false
  }
}
