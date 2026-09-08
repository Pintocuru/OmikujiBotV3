// src/sdk/post/PostWordParty.ts
import { postWordParty, postWordPartyId } from './PostOneComme'

export type ExecuteWordPartyParams = {
  wordParty?: string
  wordPartyId?: string
  repeat?: number
  delaySeconds?: number
}

export async function executeWordParty({
  wordParty,
  wordPartyId,
  repeat = 1,
  delaySeconds = 0,
}: ExecuteWordPartyParams): Promise<void> {
  const count = Math.max(1, repeat)

  for (let i = 0; i < count; i++) {
    if (wordPartyId && wordPartyId !== '') {
      postWordPartyId(wordPartyId, delaySeconds)
    } else if (wordParty) {
      postWordParty(wordParty, delaySeconds)
    }
  }
}
