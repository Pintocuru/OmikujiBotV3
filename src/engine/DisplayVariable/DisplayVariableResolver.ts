// src/engine/DisplayVariable/DisplayVariableResolver.ts
import { hasPostFlowMessage, PostFlowType } from '@/types'
import { PlaceholderVariableType } from '@/engine/types/VariablePlaceholder'

export class DisplayVariableResolver {
  constructor(private readonly context: PlaceholderVariableType) {}

  /**
   * PostAction配列のプレースホルダーを置換して返す
   */
  processPostActions(postActions: PostFlowType[]): PostFlowType[] {
    return postActions.map((action) => {
      if (hasPostFlowMessage(action)) {
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
