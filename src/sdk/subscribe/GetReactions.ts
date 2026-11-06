// src/sdk/subscribe/GetReactions.ts
import { reactionMap } from '@/maps/OmikujiData'
import { addReactionListener, startOneSDK } from '@/sdk/connection/OneSDKHub'

type ReactionMap = Record<string, number>

// emoji → label の逆引きマップをキャッシュ
const reverseMap: ReadonlyMap<string, string> = new Map(
  Object.entries((reactionMap['youtube'] ?? {}) as Record<string, string>).map(([label, emoji]) => [emoji, label])
)

let removeListener: (() => void) | null = null

/** リアクションを購読する。もう一度呼ぶと、前回の購読は解除される */
export async function GetReactions(callback: (aggregated: ReactionMap) => void): Promise<boolean> {
  removeListener?.()
  removeListener = null

  const remove = addReactionListener((payload) => {
    const aggregated: ReactionMap = {}
    for (const item of payload.reactions) {
      const label = reverseMap.get(item.key) ?? item.key
      aggregated[label] = (aggregated[label] ?? 0) + item.value
    }
    callback(aggregated)
  })
  removeListener = remove

  const ok = await startOneSDK()
  if (!ok) {
    remove()
    if (removeListener === remove) removeListener = null
  }
  return ok
}

/** リアクションの購読を解除する(購読中でなければ何もしない) */
export function unsubscribeReactions(): void {
  removeListener?.()
  removeListener = null
}

if (import.meta.hot) {
  import.meta.hot.dispose(unsubscribeReactions)
}
