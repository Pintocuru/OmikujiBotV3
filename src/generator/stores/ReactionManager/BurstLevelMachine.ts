// src/generator/stores/ReactionManager/BurstLevelMachine.ts
import type { BurstLevelChangeCallback } from '@/types/generator'
import { BURST_LEVEL_THRESHOLDS, BURST_MAX_LEVEL, BURST_PEAK_RATE_FLOOR } from '@/generator/GeneratorConstants'

export class BurstLevelMachine {
  level = 0
  levelUpCount = 0
  reachedLevel: number | null = null
  droppedLevel: number | null = null
  sustainCount = 0
  private callbacks = new Set<BurstLevelChangeCallback>()

  onChange(cb: BurstLevelChangeCallback): () => void {
    this.callbacks.add(cb)
    return () => this.callbacks.delete(cb)
  }

  add(count: number, peakRate: number): void {
    const peak = Math.max(peakRate, BURST_PEAK_RATE_FLOOR)
    const idx = Math.min(this.level, BURST_LEVEL_THRESHOLDS.length - 1)
    this.levelUpCount += count

    if (this.level < BURST_MAX_LEVEL && this.levelUpCount >= peak * BURST_LEVEL_THRESHOLDS[idx]) {
      const prev = this.level
      this.level += 1
      this.reachedLevel = this.level
      this.levelUpCount = 0
      this.sustainCount = 0
      this.fire(this.level, prev)
    } else {
      this.sustainCount += count
    }
  }

  decrement(): number {
    if (this.level > 0) {
      const prev = this.level
      this.level -= 1
      this.levelUpCount = 0
      this.sustainCount = 0
      this.reachedLevel = null
      this.droppedLevel = this.level
      this.fire(this.level, prev)
    }
    return this.level
  }

  consumeReached() {
    this.reachedLevel = null
  }
  consumeDropped() {
    this.droppedLevel = null
  }
  resetSustain() {
    this.sustainCount = 0
  }

  /** コールバックは維持したまま状態だけ初期化 */
  reset(): void {
    this.level = 0
    this.levelUpCount = 0
    this.reachedLevel = null
    this.droppedLevel = null
    this.sustainCount = 0
  }

  private fire(n: number, p: number) {
    for (const cb of this.callbacks) cb(n, p)
  }
}
