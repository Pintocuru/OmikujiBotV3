// src/common/OmikenHistory.ts
import type { OmikenCommentType } from '@/types/OmikenComment'

/**
 * 受け取り済みコメントの id を覚えておく件数の上限
 * 新しいコメントかどうかの判定に使う。超えたら古い id から忘れる。
 */
export const OMIKEN_ID_HISTORY_MAX = 20_000

/**
 * 受け取り済みコメントの id を覚え、新規コメントだけを返す
 * (購読で再配信されたコメントを、二重に処理しないため)
 */
export const createOmikenHistory = (maxHistory: number = OMIKEN_ID_HISTORY_MAX) => {
  const seenIds = new Set<string>()

  /** 新規コメントのみ記録し、新規分だけを返す */
  const addOmikens = (incoming: OmikenCommentType[]): OmikenCommentType[] => {
    const newOmikens: OmikenCommentType[] = []
    for (const omiken of incoming) {
      if (seenIds.has(omiken.id)) continue
      seenIds.add(omiken.id)
      newOmikens.push(omiken)
    }

    while (seenIds.size > maxHistory) {
      const oldest = seenIds.values().next().value
      if (oldest === undefined) break
      seenIds.delete(oldest)
    }

    return newOmikens
  }

  const clearOmikens = () => {
    seenIds.clear()
  }

  return { addOmikens, clearOmikens }
}
