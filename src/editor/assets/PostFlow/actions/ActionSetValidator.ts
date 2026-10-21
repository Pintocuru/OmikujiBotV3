// src/editor/assets/PostFlow/actions/ActionSetValidator.ts
import { PostFlowType } from '@/types/OmikujiData'

/**
 * アクションセットの循環参照をチェックする
 */
export function checkCircularReference(
  targetKey: string,
  actionSets: Record<string, { postFlows: PostFlowType[] }>,
  currentKey?: string,
  visited: Set<string> = new Set()
): string[] | null {
  if (!targetKey || !actionSets) return null

  // 自分自身を参照している場合
  if (currentKey && targetKey === currentKey) {
    return [currentKey, targetKey]
  }

  // 既に訪問済みなら循環参照
  if (visited.has(targetKey)) return [targetKey]

  const actionSet = actionSets[targetKey]
  if (!actionSet?.postFlows) return null

  visited.add(targetKey)

  for (const action of actionSet.postFlows) {
    if (action.kind !== 'flowCall') continue

    const keys = action.callKeys ?? []

    // 参照先キーを抽出（string または WeightValueType.content）
    const referencedKeys = keys
      .map((k) => (typeof k === 'string' ? k : k.content))
      .filter((k) => k && typeof k === 'string')

    for (const nextKey of referencedKeys) {
      const circularPath = checkCircularReference(nextKey, actionSets, currentKey, new Set(visited))
      if (circularPath) return [targetKey, ...circularPath]
    }
  }

  return null
}
