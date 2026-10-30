// src/engine/OmikujiResult/FlowCallExpander.ts
import { drawOmikuji } from '@/engine/DrawOmikuji/DrawOmikuji'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { ScenarioType, handelNormalizedValues, ScenarioStepCallType, ScenarioStepType } from '@/types/OmikujiData/'

export class FlowCallExpander {
  private static readonly MAX_DEPTH = 10

  static expand(
    flow: ScenarioStepType[],
    flowSets: Record<string, ScenarioType>,
    depth: number = 0,
    visited: Set<string> = new Set()
  ): ScenarioStepType[] {
    if (depth >= this.MAX_DEPTH) {
      const msg = `シナリオの展開が最大階層(${this.MAX_DEPTH})に達しました`
      console.warn(msg)
      postSystemMessage(msg, { username: 'warn' })
      return flow
    }

    const expandedActions: ScenarioStepType[] = []

    for (const action of flow) {
      // flowCallなら呼び出して展開
      if (action.kind === 'scenarioCall') {
        const expandedAction = this.expandSingleFlowCall(action, flowSets, depth, visited)
        expandedActions.push(...expandedAction)
      } else {
        expandedActions.push(action)
      }
    }

    return expandedActions
  }

  /**
   *
   */
  private static expandSingleFlowCall(
    flow: ScenarioStepCallType,
    flowSets: Record<string, ScenarioType>,
    depth: number,
    visited: Set<string>
  ): ScenarioStepType[] {
    // 抽選を行う
    const normalized = handelNormalizedValues(flow.callKeys)
    const targetKeyObject = drawOmikuji(normalized)
    if (!targetKeyObject) return []
    const targetKey = targetKeyObject.content

    // 循環参照チェック
    if (visited.has(targetKey)) {
      const msg = `循環参照が検出されました: ${targetKey}`
      console.error(msg)
      postSystemMessage(msg)
      return []
    }

    // 展開
    const targetActionSet = flowSets[targetKey]
    if (!targetActionSet) {
      const msg = `シナリオ "${targetKey}" が見つかりません`
      console.error(msg)
      postSystemMessage(msg)
      return []
    }

    const newVisited = new Set(visited)
    newVisited.add(targetKey)

    const adjustedActions = this.adjustDelays(targetActionSet.steps, flow.delaySeconds)

    return this.expand(adjustedActions, flowSets, depth + 1, newVisited)
  }

  private static adjustDelays(actions: ScenarioStepType[], baseDelay: number): ScenarioStepType[] {
    return actions.map((action) => ({
      ...action,
      delaySeconds: (action.delaySeconds || 0) + baseDelay,
    }))
  }
}
