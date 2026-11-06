// src/generator/stores/useOmikensActions.ts
import { OmikenCommentType } from '@/types/OmikenComment'
import { OMIKEN_ID_HISTORY_MAX } from '@/generator/GeneratorConstants'

export const useOmikensActions = () => {
  // 受け取り済みのコメント id (新しいコメントかどうかの判定用)
  // 配信が長くなっても増え続けないよう、上限を超えたら古いものから捨てる
  const seenIds = new Set<string>()

  /**
   * 新規コメントのみ追加し、追加分だけを返す
   */
  const addOmikens = (incoming: OmikenCommentType[]): OmikenCommentType[] => {
    const newOmikens: OmikenCommentType[] = []
    for (const omiken of incoming) {
      if (seenIds.has(omiken.id)) continue
      seenIds.add(omiken.id)
      newOmikens.push(omiken)
    }

    while (seenIds.size > OMIKEN_ID_HISTORY_MAX) {
      const oldest = seenIds.values().next().value
      if (oldest === undefined) break
      seenIds.delete(oldest)
    }

    return newOmikens
  }

  const clearOmikens = () => {
    seenIds.clear()
  }

  return {
    addOmikens,
    clearOmikens,
  }
}
