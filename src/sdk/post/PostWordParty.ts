// src/sdk/post/PostWordParty.ts
import { postWordPartyId } from './PostOneComme'

/**
 * WordParty を実行する。
 * delaySeconds はタイムライン上の発火時刻(repeat 回ぶんが同じ時刻に発火する)。完了は待たない。
 */
export async function executeWordParty({
  wordPartyId,
  repeat = 1,
  delaySeconds = 0,
}: {
  wordPartyId?: string
  repeat?: number
  delaySeconds?: number
}): Promise<void> {
  if (!wordPartyId) return

  const count = Number.isFinite(repeat) ? Math.max(1, Math.floor(repeat)) : 1

  for (let i = 0; i < count; i++) {
    // 失敗の記録は delayPost 側で済んでいる。待たない設計のため、未処理 reject だけ防ぐ
    postWordPartyId(wordPartyId, delaySeconds).catch(() => {
      //
    })
  }
}
