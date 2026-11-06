// src/sdk/post/PostOneComme.ts
import { api } from '@/sdk/client'
import { SendCommentType, SendTestCommentSchema, SendTestCommentType } from '@/types/subscribe'

/**
 * わんコメにコメントを投稿
 */
export async function postComment(request: SendCommentType, delaySeconds: number = 0): Promise<void> {
  return delayPost('/comments', request, delaySeconds, 'わんコメへのコメント投稿に失敗しました')
}

/**
 * WordPartyのIDを指定してリアクションを投稿
 */
export async function postWordPartyId(id: string, delaySeconds: number = 0): Promise<void> {
  return delayPost(`/wordparty/${id}`, undefined, delaySeconds, 'WordPartyリアクションの投稿に失敗しました')
}

/**
 * 音声合成（Speech）にテキストを投稿
 */
export async function postSpeech(content: string, delaySeconds: number = 0): Promise<void> {
  return delayPost('/speech', { text: content }, delaySeconds, 'スピーチの投稿に失敗しました')
}

// throttle 用のタイムスタンプ（モジュールスコープで管理）
let lastPostedAt = 0
const THROTTLE_MS = 3000

/**
 * コメントテスター機能を使用してテストコメントを投稿
 * 通知用なので、投稿に失敗しても reject しない(わんコメ停止中のエラー通知が、さらにエラーにならないように)
 */
export async function postSystemMessage(
  comment: string,
  options: {
    username?: string
    delaySeconds?: number
    speech?: boolean
    throttle?: boolean // true の場合、3秒に1回だけ投稿
  } = {}
): Promise<void> {
  const { username = '__ERROR__', delaySeconds = 0, speech = true, throttle = false } = options

  if (throttle) {
    const now = Date.now()
    if (now - lastPostedAt < THROTTLE_MS) return
    lastPostedAt = now
  }

  try {
    const request: SendTestCommentType = SendTestCommentSchema.parse({
      username,
      comment,
      speech,
    })

    await delayPost('/comments/test', request, delaySeconds, 'テストコメントの投稿に失敗しました')
  } catch (error) {
    // 投稿の失敗は delayPost 側でログ済み。ここでは握りつぶす
    console.warn('[postSystemMessage] 投稿できませんでした:', error)
  }
}

/**
 * 遅延付き POST
 */
function delayPost(endpoint: string, data: unknown, delaySeconds: number, errorMessage: string): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        await api.post(endpoint, data)
        resolve()
      } catch (error) {
        console.error(errorMessage, error)
        reject(error)
      }
    }, delaySeconds * 1000)
  })
}
