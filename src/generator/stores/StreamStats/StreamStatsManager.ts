// src/generator/stores/StreamStats/StreamStatsManager.ts
import { OmikenCommentType } from '@/types/OmikenComment'

export interface StreamStats {
  liveComments: number
  totalComments: number
  syoken: number
  totalPrice: number
}

/**
 * 配信全体の集計値を管理するクラス
 */
export class StreamStatsManager {
  private readonly changeListeners = new Set<() => void>()

  private liveComments = 0
  private totalPrice = 0
  private syoken = 0
  private totalComments = 0
  private seenUsers = new Set<string>()

  record(omiken: OmikenCommentType): void {
    const { tc, lc } = omiken.meta
    const giftPrice = omiken.giftPrice ?? 0
    const userId = omiken.userId

    if (tc === 1) this.syoken++

    if (!this.seenUsers.has(userId)) {
      this.totalComments += tc
      this.seenUsers.add(userId)
    } else {
      this.totalComments += 1
    }

    this.liveComments = lc
    this.totalPrice += giftPrice
    this.notifyChange()
  }

  getStats(): StreamStats {
    return {
      liveComments: this.liveComments,
      syoken: this.syoken,
      totalPrice: this.totalPrice,
      totalComments: this.totalComments,
    }
  }

  /**
   * 集計値が変わったとき(コメントの記録・リセット)に呼ばれるリスナーを登録する (解除用関数を返す)
   * 複数の UI が同時に購読できる。
   */
  onChange(listener: () => void): () => void {
    this.changeListeners.add(listener)
    return () => this.changeListeners.delete(listener)
  }

  reset(): void {
    this.liveComments = 0
    this.totalPrice = 0
    this.syoken = 0
    this.totalComments = 0
    this.seenUsers.clear()
    this.notifyChange()
  }

  private notifyChange(): void {
    // 1 つの購読者の失敗で、コメントの記録を止めない
    this.changeListeners.forEach((l) => {
      try {
        l()
      } catch (error) {
        console.error('[StreamStatsManager] 変更通知の購読者でエラー:', error)
      }
    })
  }
}
