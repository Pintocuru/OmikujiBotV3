// src/sdk/connection/OneSDKHub.ts
//
// OneSDK への接続をアプリ全体で1つにまとめる。
// - OneSDK.setup / connect は1回だけ。コメントとリアクションの権限は最初から両方とも要求する
//   (別々に setup すると、あとから呼んだ側の設定で権限が上書きされる可能性があるため)
// - 購読(subscribe)もここで1回ずつ行い、GetComments / GetReactions はリスナーとして参加する
// - 接続直後に届く履歴コメントは、コメントのリスナーが付くまで預かる(呼び出し順に依存しない)
import OneSDK from '@onecomme.com/onesdk'
import type { PublishActions } from '@onecomme.com/onesdk/types/ApiActions'
import type { Comment } from '@onecomme.com/onesdk/types/Comment'
import type { OneSDKConfig } from '@onecomme.com/onesdk/types/SDK'
import { PingOneSDK } from './PingOneSDK'

export type ReactionsPayload = PublishActions['reactions']
type CommentListener = (comments: Comment[]) => void
type ReactionListener = (payload: ReactionsPayload) => void

// 接続直後に履歴として受け取るコメント数の上限
const COMMENT_LIMIT_INITIAL = 99999
// 履歴を受け取ったあとの通常の保持数
export const COMMENT_LIMIT_NORMAL = 100

const commentListeners = new Set<CommentListener>()
const reactionListeners = new Set<ReactionListener>()

let startPromise: Promise<boolean> | null = null
let subscriberIds: number[] = []
let historyReceived = false // 最初のコメント受信(履歴。空でも1回と数える)を済ませたか
let pendingComments: Comment[] | null = null // コメントのリスナーが付く前に届いた分

function buildConfig(commentLimit: number): Partial<OneSDKConfig> {
  return {
    permissions: OneSDK.usePermission([OneSDK.PERM.COMMENT, OneSDK.PERM.REACTION]),
    mode: 'all',
    commentLimit,
  }
}

/** リスナーを1つずつ呼ぶ。1つが例外を投げても、ほかのリスナーと OneSDK 本体には影響させない */
function notify<T>(listeners: Iterable<(value: T) => void>, value: T): void {
  for (const listener of [...listeners]) {
    try {
      listener(value)
    } catch (error) {
      console.error('[OneSDKHub] リスナーでエラー:', error)
    }
  }
}

function handleComments(comments: Comment[]): void {
  if (!historyReceived) {
    historyReceived = true
    // 履歴を受け取り終えたので、保持数を通常に戻す(権限は同じ設定のまま)
    OneSDK.setup(buildConfig(COMMENT_LIMIT_NORMAL)).catch((error) => {
      console.error('[OneSDKHub] OneSDK の再設定に失敗:', error)
    })
  }

  if (commentListeners.size === 0) {
    pendingComments = [...(pendingComments ?? []), ...comments].slice(-COMMENT_LIMIT_INITIAL)
    return
  }
  notify(commentListeners, comments)
}

async function connect(): Promise<boolean> {
  try {
    if (!(await PingOneSDK())) return false

    await OneSDK.setup(buildConfig(COMMENT_LIMIT_INITIAL))

    // 履歴は接続直後に届くので、購読 → 接続 の順にする
    subscriberIds = [
      OneSDK.subscribe({ action: 'comments', callback: handleComments }),
      OneSDK.subscribe({
        action: 'reactions',
        callback: (payload: ReactionsPayload) => notify(reactionListeners, payload),
      }),
    ]
    await OneSDK.connect()
    return true
  } catch (error) {
    console.error('OneSDK 初期化エラー:', error)
    release()
    return false
  }
}

/** 購読を解除し、接続まわりの状態を初期化する(リスナーの登録は残す) */
function release(): void {
  for (const id of subscriberIds) OneSDK.unsubscribe(id)
  subscriberIds = []
  startPromise = null
  historyReceived = false
  pendingComments = null
}

/** OneSDK に接続する(接続済み・接続中なら、その結果を共有する。失敗したら次回やり直せる) */
export function startOneSDK(): Promise<boolean> {
  if (!startPromise) {
    startPromise = connect().then((ok) => {
      if (!ok) startPromise = null
      return ok
    })
  }
  return startPromise
}

/** 接続を張り直す(履歴を取り直したいとき用)。登録済みのリスナーはそのまま使われる */
export function restartOneSDK(): Promise<boolean> {
  release()
  return startOneSDK()
}

/** 履歴がすでにリスナーへ渡し終わっていて、新しいリスナーには届かない状態か */
export function isHistoryConsumed(): boolean {
  return historyReceived && pendingComments === null
}

/** コメントのリスナーを追加する。預かっている履歴があれば、すぐに渡す。戻り値は解除関数 */
export function addCommentListener(listener: CommentListener): () => void {
  commentListeners.add(listener)
  if (pendingComments) {
    const pending = pendingComments
    pendingComments = null
    notify([listener], pending)
  }
  return () => {
    commentListeners.delete(listener)
  }
}

/** リアクションのリスナーを追加する。戻り値は解除関数 */
export function addReactionListener(listener: ReactionListener): () => void {
  reactionListeners.add(listener)
  return () => {
    reactionListeners.delete(listener)
  }
}

if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    release()
    commentListeners.clear()
    reactionListeners.clear()
  })
}
