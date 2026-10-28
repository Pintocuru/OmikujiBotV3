// src/sdk/subscribe/OmikenComment/GetOmikenComments.ts
import { OmikenCommentType } from '@/types/OmikenComment/'
import { GetComments } from '../GetComments'
import { processOmikenComments } from './OmikenCommentProcessor'
import { Comment } from '@onecomme.com/onesdk/types/Comment'

/**
 * わんコメのコメントをおみくじBOT用に加工
 */
export async function GetOmikenComments(
  callback: (omikens: OmikenCommentType[], isReset: boolean, isFirstLoad: boolean) => void
): Promise<boolean> {
  let isFirstLoad = true
  const call = (comments: unknown) => {
    if (!Array.isArray(comments)) {
      throw new TypeError(`[GetOmikenComments] 不正なデータ形式: ${typeof comments}`)
    }

    // 初回の受信(履歴)は、空配列でも「初回」を消費する。
    // 消費しないと、履歴が空の配信で最初に来た本物のコメントが履歴扱いになり、応答されない
    const currentIsFirstLoad = isFirstLoad // 呼び出し時点の値を保持
    isFirstLoad = false

    if (comments.length === 0) {
      callback([], true, currentIsFirstLoad)
      return
    }

    const omikens = processOmikenComments(comments as Comment[])
    callback(omikens, false, currentIsFirstLoad)
  }

  try {
    const result = await GetComments(call, { initialLoad: isFirstLoad })

    return result
  } catch (error) {
    console.error('[GetOmikenComments] コメント受信エラー:', error)
    throw error
  }
}
