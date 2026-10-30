// src/engine/DisplayVariable/DisplayVariableResolver.ts
import { hasScenarioStepMessage, ScenarioStepType } from '@/types/OmikujiData'
import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'

export class DisplayVariableResolver {
  constructor(private readonly context: PlaceholderVariableType) {}

  /**
   * ステップ配列のプレースホルダーを置換して返す
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
      if (hasScenarioStepMessage(step)) {
        return {
          ...step,
          message: this.resolve(step.message),
        }
      }
      return step
    })
  }

  /**
   * [[key]] を現在の変数値で置換
   * 未定義時は {{key}} に変換
   */
  resolve(text?: string): string {
    if (!text) return ''
    const vars = this.context.getAll()
    return text.replace(/\[\[([^\]]+)\]\]/g, (_: string, key: string) => {
      if (Object.prototype.hasOwnProperty.call(vars, key)) {
        return String(vars[key])
      }
      return `{{${key}}}`
    })
  }
}
