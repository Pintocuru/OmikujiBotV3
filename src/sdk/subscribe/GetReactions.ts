// src/sdk/subscribe/GetReactions.ts
import { reactionMap } from '@/types'
import { PingOneSDK } from '../connection/PingOneSDK'
import OneSDK from '@onecomme.com/onesdk'

interface Payload {
  reactions: Reactions[]
  effect: boolean
}
interface Reactions {
  key: string // emoji文字列 "🧡" など
  value: number
}

type ReactionMap = Record<string, number>

// emoji → label の逆引きマップをキャッシュ
const reverseMap: Record<string, string> = (() => {
  const map = reactionMap['youtube'] as Record<string, string>
  const reversed: Record<string, string> = {}
  for (const [label, emoji] of Object.entries(map)) {
    reversed[emoji] = label
  }
  return reversed
})()

let currentSubscriberId: number | null = null

export async function GetReactions(
  callback: (aggregated: ReactionMap) => void,
  platform: 'youtube' = 'youtube'
): Promise<boolean> {
  try {
    if (currentSubscriberId !== null) {
      console.log(`HMR: 既存の購読ID ${currentSubscriberId} を解除します`)
      OneSDK.unsubscribe(currentSubscriberId)
      currentSubscriberId = null
    }

    if (!(await PingOneSDK())) return false

    await OneSDK.setup({ permissions: OneSDK.usePermission([OneSDK.PERM.REACTION]) })

    currentSubscriberId = OneSDK.subscribe({
      action: 'reactions',
      callback: (payload: Payload) => {
        const aggregated: ReactionMap = {}

        for (const item of payload.reactions) {
          const label = reverseMap[item.key] ?? item.key
          aggregated[label] = (aggregated[label] ?? 0) + item.value
        }

        callback(aggregated)
      },
    })

    await OneSDK.connect()
    return true
  } catch (error) {
    console.error('OneSDK初期化エラー:', error)
    return false
  }
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    if (currentSubscriberId !== null) {
      console.log(`HMR: 既存の購読ID ${currentSubscriberId} を解除します`)
      OneSDK.unsubscribe(currentSubscriberId)
      currentSubscriberId = null
    }
  })
}
