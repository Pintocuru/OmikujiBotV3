// src/generator/stores/StreamStats/StreamStatsManager.ts
import { shallowReactive } from 'vue'
import { OmikenCommentType } from '@/types/OmikenComment'

export interface StreamStats {
  liveComments: number
  totalComments: number
  syoken: number
  totalPrice: number
}

/**
 * 配信全体の集計値を管理するクラス
 * 集計値は Vue のリアクティブな状態として持つ。getStats() を computed / watch の中で読めば、
 * record() / reset() を誰が (どの経路で) 呼んでも、画面に反映される。
 */
export class StreamStatsManager {
  private readonly stats = shallowReactive<StreamStats>({
    liveComments: 0,
    totalComments: 0,
    syoken: 0,
    totalPrice: 0,
  })
  // 内部の判定用 (画面には出さない)
  private readonly seenUsers = new Set<string>()

  record(omiken: OmikenCommentType): void {
    const { tc, lc } = omiken.meta
    const giftPrice = omiken.giftPrice ?? 0
    const userId = omiken.userId

    if (tc === 1) this.stats.syoken++

    if (!this.seenUsers.has(userId)) {
      this.stats.totalComments += tc
      this.seenUsers.add(userId)
    } else {
      this.stats.totalComments += 1
    }

    this.stats.liveComments = lc
    this.stats.totalPrice += giftPrice
  }

  getStats(): StreamStats {
    return { ...this.stats }
  }

  reset(): void {
    this.stats.liveComments = 0
    this.stats.totalPrice = 0
    this.stats.syoken = 0
    this.stats.totalComments = 0
    this.seenUsers.clear()
  }
}
