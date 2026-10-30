// src/engine/DisplayVariable/DisplayVariableResolver.ts
import { hasScenarioStepMessage, ScenarioStepType } from '@/types/OmikujiData'
import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'

export class DisplayVariableResolver {
  constructor(private readonly context: PlaceholderVariableType) {}

  /**
   * PostAction配列のプレースホルダーを置換して返す
   */
  processSteps(steps: ScenarioStepType[]): ScenarioStepType[] {
    return steps.map((action) => {
      if (action.kind === 'message') {
        return {
          ...action,
          message: this.resolve(action.message),
          slots: Object.fromEntries(Object.entries(action.slots).map(([k, v]) => [k, this.resolve(v)])),
        }
      }
      // wordParty の wordPartyId を [[key]] で置換
      if (action.kind === 'wordParty') {
        return { ...action, wordPartyId: this.resolve(action.wordPartyId) }
      }
      // gameScript の queryString を [[key]] で置換
      if (action.kind === 'gameScript') {
        return { ...action, queryString: this.resolve(action.queryString) }
      }
      if (hasScenarioStepMessage(action)) {
        return {
          ...action,
          message: this.resolve(action.message),
        }
      }
      return action
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
