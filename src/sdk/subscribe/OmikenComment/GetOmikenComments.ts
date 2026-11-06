// src/sdk/subscribe/OmikenComment/GetOmikenComments.ts
import type { OmikenCommentType } from '@/types/OmikenComment'
import { GetComments } from '../GetComments'
import { processOmikenComments } from './OmikenCommentProcessor'

/**
 * わんコメのコメントをおみくじBOT用に加工
 */
export async function GetOmikenComments(
  callback: (omikens: OmikenCommentType[], isReset: boolean, isFirstLoad: boolean) => void
): Promise<boolean> {
  let isFirstLoad = true

  const handleComments = (comments: unknown): void => {
    if (!Array.isArray(comments)) {
      throw new TypeError(`[GetOmikenComments] 不正なデータ形式: ${typeof comments}`)
    }

    // 初回の受信(履歴)は、空配列でも「初回」を消費する。
    // 消費しないと、履歴が空の配信で最初に来た本物のコメントが履歴扱いになり、応答されない
    const currentIsFirstLoad = isFirstLoad
    isFirstLoad = false

    if (comments.length === 0) {
      callback([], true, currentIsFirstLoad)
      return
    }
    callback(processOmikenComments(comments), false, currentIsFirstLoad)
  }

  return GetComments(handleComments, { initialLoad: true })
}
