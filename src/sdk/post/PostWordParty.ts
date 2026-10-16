// src/sdk/post/PostWordParty.ts
import { postWordPartyId } from './PostOneComme'

export type ExecuteWordPartyParams = {
  wordPartyId?: string
  repeat?: number
  delaySeconds?: number
}

export async function executeWordParty({
  wordPartyId,
  repeat = 1,
  delaySeconds = 0,
}: ExecuteWordPartyParams): Promise<void> {
  const count = Math.max(1, repeat)

  for (let i = 0; i < count; i++) {
    if (wordPartyId && wordPartyId !== '') postWordPartyId(wordPartyId, delaySeconds)
  }
}
