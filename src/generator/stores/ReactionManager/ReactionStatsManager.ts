// src/generator/stores/ReactionManager/ReactionStatsManager.ts
import { ReactionTotals } from './ReactionTotals'
import { PeakRateTracker } from './PeakRateTracker'
import { BurstLevelMachine } from './BurstLevelMachine'
import { BurstLevelChangeCallback, BurstState, ReactionStatsManagerType } from '@/types/generator'

export class ReactionStatsManager implements ReactionStatsManagerType {
  private totals = new ReactionTotals()
  private peak = new PeakRateTracker()
  private burst = new BurstLevelMachine()

  record(reactions: Record<string, number>): void {
    const now = Date.now()
    const count = this.totals.add(reactions, now)
    this.peak.update(now, count)
    this.burst.add(count, this.peak.value)
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
  getTotal(types: string[]) {
    return this.totals.getTotal(types)
  }
  getGrandTotal() {
    return this.totals.getGrandTotal()
  }
  getHistory() {
    return this.totals.getHistory()
  }

  reset(): void {
    this.totals.reset()
    this.peak.reset()
    this.burst.reset()
  }
}
