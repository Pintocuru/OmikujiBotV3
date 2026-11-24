// src/generator/stores/ReactionManager/ReactionStatsManager.ts
import { ReactionTotals } from './ReactionTotals'
import { PeakRateTracker } from './PeakRateTracker'
import { BurstLevelMachine } from './BurstLevelMachine'
import type { BurstLevelChangeCallback, BurstState, ReactionStatsManagerType } from '@/types/generator'
import type { YoutubeReactionType } from '@/types/OmikujiData'

export class ReactionStatsManager implements ReactionStatsManagerType {
  private totals = new ReactionTotals()
  private peak = new PeakRateTracker()
  private burst = new BurstLevelMachine()
  private readonly changeListeners = new Set<() => void>()

  record(reactions: Record<string, number>): void {
    const now = Date.now()
    const count = this.totals.add(reactions, now)
    this.peak.update(now, count)
    this.burst.add(count, this.peak.value)
    this.notifyChange()
  }

  getBurstState(): BurstState {
    return {
      level: this.burst.level,
      levelUpCount: this.burst.levelUpCount,
      peakRate: this.peak.value,
      lastEventTime: this.peak.lastTime,
      reachedLevel: this.burst.reachedLevel,
      droppedLevel: this.burst.droppedLevel,
      sustainCount: this.burst.sustainCount,
    }
  }

  decrementBurstLevel() {
    return this.burst.decrement()
  }
  onBurstLevelChange(cb: BurstLevelChangeCallback) {
    return this.burst.onChange(cb)
  }
  consumeReachedLevel() {
    this.burst.consumeReached()
  }
  consumeDroppedLevel() {
    this.burst.consumeDropped()
  }
  resetSustainCount() {
    this.burst.resetSustain()
  }
  getTotal(types: YoutubeReactionType[]) {
    return this.totals.getTotal(types)
  }
  getGrandTotal() {
    return this.totals.getGrandTotal()
  }
  getHistory() {
    return this.totals.getHistory()
  }

  /**
   * リアクションの集計が変わったとき(記録・リセット)に呼ばれるリスナーを登録する (解除用関数を返す)
   * バーストレベルの変化は onBurstLevelChange を使う。
   */
  onChange(listener: () => void): () => void {
    this.changeListeners.add(listener)
    return () => this.changeListeners.delete(listener)
  }

  reset(): void {
    this.totals.reset()
    this.peak.reset()
    this.burst.reset()
    this.notifyChange()
  }

  private notifyChange(): void {
    // 1 つの購読者の失敗で、リアクションの記録を止めない
    this.changeListeners.forEach((l) => {
      try {
        l()
      } catch (error) {
        console.error('[ReactionStatsManager] 変更通知の購読者でエラー:', error)
      }
    })
  }
}
