// shared/sdk/subscribe/OmikenComment/GetOmikenComments.ts
import { OmikenCommentType } from '../../../types/OmikenComment/OmikenCommentSchema'
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

    if (comments.length === 0) {
      callback([], true, isFirstLoad)
      return
    }

    const currentIsFirstLoad = isFirstLoad // ★ 呼び出し時点の値を保持
    isFirstLoad = false // ★ コールバック内でリセット

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
