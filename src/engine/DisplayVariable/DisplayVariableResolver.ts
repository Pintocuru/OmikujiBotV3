// src/engine/DisplayVariable/DisplayVariableResolver.ts
import { ScenarioStepType } from '@/types/OmikujiData'
import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'

/** [[key]] (key の前後の空白は無視する) */
const DISPLAY_VARIABLE_PATTERN = /\[\[\s*([^\]]+?)\s*\]\]/g

/**
 * text 内の [[key]] を、vars の値で置換する。未定義の変数は [[key]] のまま残す
 * (ContentPlaceholder が <<...[[key]]...>> の中を置換するときにも使う)
 */
export function replaceDisplayVariables(text: string, vars: Record<string, string | number>): string {
  return text.replace(DISPLAY_VARIABLE_PATTERN, (match: string, key: string) =>
    Object.prototype.hasOwnProperty.call(vars, key) ? String(vars[key]) : match
  )
}

/**
 * 変数の値を [[key]] で本文に出す。
 * 変数を書き換えるのは variable ステップだけで、ここは読み取りだけを行う。
 */
export class DisplayVariableResolver {
  constructor(private readonly context: PlaceholderVariableType) {}

  /**
   * ステップ配列の [[key]] を置換して返す
   * variable ステップの本文は式なので対象外 (変数名をそのまま書く)
   */
  processSteps(steps: ScenarioStepType[]): ScenarioStepType[] {
    return steps.map((step) => {
      if (step.kind === 'message') {
        return {
          ...step,
          message: this.resolve(step.message),
          slots: Object.fromEntries(Object.entries(step.slots).map(([k, v]) => [k, this.resolve(v)])),
        }
      }
      // wordParty の wordPartyId を [[key]] で置換
      if (step.kind === 'wordParty') {
        return { ...step, wordPartyId: this.resolve(step.wordPartyId) }
      }
      // gameScript の queryString を [[key]] で置換
      if (step.kind === 'gameScript') {
        return { ...step, queryString: this.resolve(step.queryString) }
      }
      return step
    })
  }

  /**
   * [[key]] を現在の変数値で置換
   * 未定義の変数は、そのまま [[key]] を残す
   */
  resolve(text?: string): string {
    if (!text) return ''
    return replaceDisplayVariables(text, this.context.getAll())
  }
}
