// src/ui/comment/UserComment/scripts/userCommentEntries.ts
import type { BotMessageBubbleType } from '@/types/generator'
import type { UserCommentType } from '@/types/ui'
import { resolveCommentName } from './userCommentName'

/** 1件分の表示内容(元コメント + おみくじ結果) */
export type UserCommentEntry = {
  id: string
  name: string
  comment: string // 元コメント(ユーザー入力。HTML として扱わない)
  reply: string // おみくじ結果(BOT が作る文面)
}

/**
 * BotMessage を表示用に変換する。
 * - origin(元コメント)がないメッセージは対象外(comment イベント以外)
 * - 新しいものから maxItems 件を、古い順で返す
 */
export function buildEntries(
  messages: BotMessageBubbleType[],
  settings: Pick<UserCommentType, 'maxItems' | 'nameMode'>
): UserCommentEntry[] {
  return messages
    .flatMap((message) => {
      const origin = message.origin
      if (!origin) return []
      return [
        {
          id: message.id,
          name: resolveCommentName(origin, settings.nameMode),
          comment: origin.comment,
          reply: message.bubble.message,
        },
      ]
    })
    .slice(-settings.maxItems)
}
