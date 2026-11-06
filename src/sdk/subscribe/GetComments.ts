// src/sdk/subscribe/GetComments.ts
import {
  COMMENT_LIMIT_NORMAL,
  addCommentListener,
  isHistoryConsumed,
  restartOneSDK,
  startOneSDK,
} from '@/sdk/connection/OneSDKHub'
import type { Comment } from '@onecomme.com/onesdk/types/Comment'

let removeListener: (() => void) | null = null

/**
 * コメントを購読する。もう一度呼ぶと、前回の購読は解除される。
 * - initialLoad: true なら、最初の受信で履歴をすべて受け取る(false なら直近 COMMENT_LIMIT_NORMAL 件まで)
 */
export async function GetComments(
  callback: (comments: Comment[]) => void,
  options: { initialLoad?: boolean } = {}
): Promise<boolean> {
  removeListener?.()
  removeListener = null

  // 履歴をすでに他のリスナーへ配り終えた接続に後から参加しても、履歴は届かない。その場合は接続を張り直す
  const needsRestart = isHistoryConsumed()

  let isFirstDelivery = true
  const remove = addCommentListener((comments) => {
    const list = isFirstDelivery && !options.initialLoad ? comments.slice(-COMMENT_LIMIT_NORMAL) : comments
    isFirstDelivery = false
    callback(list)
  })
  removeListener = remove

  const ok = await (needsRestart ? restartOneSDK() : startOneSDK())
  if (!ok) {
    remove()
    if (removeListener === remove) removeListener = null
  }
  return ok
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    removeListener?.()
    removeListener = null
  })
}
