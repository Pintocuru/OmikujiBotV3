// src/ui/CommentBubble/notifyCommentBubbleComponentIssue.ts
import { postSystemMessage } from '@/sdk/post/PostOneComme'

const notifiedIds = new Set<string>()

/** 同じページ読み込み中、コンポーネント ID ごとに一度だけ通知する。 */
export function notifyCommentBubbleComponentIssue(id: string, message: string): void {
  if (notifiedIds.has(id)) return
  notifiedIds.add(id)
  void postSystemMessage(message, { username: 'warn', speech: false }).catch(() => {
    // 失敗しても何もしない
  })
}
