// src/engine/OmikujiProcess/FlowCallExpander.ts
import { drawOmikuji } from '@/engine/DrawOmikuji/DrawOmikuji'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { ActionSetType, handelNormalizedValues, PostFlowCallType, PostFlowType } from '@/types/OmikujiData/'

export class FlowCallExpander {
  private static readonly MAX_DEPTH = 10

  static expand(
    flow: PostFlowType[],
    flowSets: Record<string, ActionSetType>,
    depth: number = 0,
    visited: Set<string> = new Set()
  ): PostFlowType[] {
    if (depth >= this.MAX_DEPTH) {
      const msg = `アクションセットの展開が最大階層(${this.MAX_DEPTH})に達しました`
      console.warn(msg)
      postSystemMessage(msg, { username: 'warn' })
      return flow
    }

    const expandedActions: PostFlowType[] = []

    for (const action of flow) {
      // flowCallなら呼び出して展開
      if (action.kind === 'flowCall') {
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
    flow: PostFlowCallType,
    flowSets: Record<string, ActionSetType>,
    depth: number,
    visited: Set<string>
  ): PostFlowType[] {
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
      const msg = `アクションセット "${targetKey}" が見つかりません`
      console.error(msg)
      postSystemMessage(msg)
      return []
    }

    const newVisited = new Set(visited)
    newVisited.add(targetKey)

    const adjustedActions = this.adjustDelays(targetActionSet.postFlows, flow.delaySeconds)

    return this.expand(adjustedActions, flowSets, depth + 1, newVisited)
  }

  private static adjustDelays(actions: PostFlowType[], baseDelay: number): PostFlowType[] {
    return actions.map((action) => ({
      ...action,
      delaySeconds: (action.delaySeconds || 0) + baseDelay,
    }))
  }
}
