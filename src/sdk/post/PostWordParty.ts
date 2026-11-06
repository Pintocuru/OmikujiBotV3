// src/sdk/post/PostWordParty.ts
import { postWordPartyId } from './PostOneComme'

export async function executeWordParty({
  wordPartyId,
  repeat = 1,
  delaySeconds = 0,
}: {
  wordPartyId?: string
  repeat?: number
  delaySeconds?: number
}): Promise<void> {
  const count = Math.max(1, repeat)

  for (let i = 0; i < count; i++) {
    if (wordPartyId && wordPartyId !== '') postWordPartyId(wordPartyId, delaySeconds).catch(() => {
        // 失敗の記録は delayPost 側で済んでいる。待たない設計のため未処理 reject だけ防ぐ
      })
  }
}
