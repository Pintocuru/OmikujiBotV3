// src/generator/stores/ReactionManager/BurstLevelMachine.ts
import { BurstLevelChangeCallback } from '@/types/generator'

const THRESHOLDS = [0.25, 0.5, 0.75] as const
const PEAK_RATE_FLOOR = 30
const MAX_LEVEL = 3

export class BurstLevelMachine {
  level = 0
  levelUpCount = 0
  reachedLevel = -1
  droppedLevel = -1
  sustainCount = 0
  private callbacks = new Set<BurstLevelChangeCallback>()

  onChange(cb: BurstLevelChangeCallback): () => void {
    this.callbacks.add(cb)
    return () => this.callbacks.delete(cb)
  }

  add(count: number, peakRate: number): void {
    const peak = Math.max(peakRate, PEAK_RATE_FLOOR)
    const idx = Math.min(this.level, THRESHOLDS.length - 1)
    this.levelUpCount += count

    if (this.level < MAX_LEVEL && this.levelUpCount >= peak * THRESHOLDS[idx]) {
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
      this.reachedLevel = -1
      this.droppedLevel = this.level
      this.fire(this.level, prev)
    }
    return this.level
  }

  consumeReached() {
    this.reachedLevel = -1
  }
  consumeDropped() {
    this.droppedLevel = -1
  }
  resetSustain() {
    this.sustainCount = 0
  }

  /** コールバックは維持したまま状態だけ初期化 */
  reset(): void {
    this.level = 0
    this.levelUpCount = 0
    this.reachedLevel = -1
    this.droppedLevel = -1
    this.sustainCount = 0
  }

  private fire(n: number, p: number) {
    if (n === p) return
    for (const cb of this.callbacks) cb(n, p)
  }
}
