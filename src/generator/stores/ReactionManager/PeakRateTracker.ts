// src/generator/stores/ReactionManager/PeakRateTracker.ts
import { PEAK_RATE_ELAPSED_CAP_SEC } from '@/generator/GeneratorConstants'

export class PeakRateTracker {
  private peak = 0
  private lastEventTime: number | null = null

  get value() {
    return this.peak
  }
  get lastTime() {
    return this.lastEventTime
  }

  update(now: number, count: number): void {
    if (this.lastEventTime !== null) {
      const elapsed = Math.min((now - this.lastEventTime) / 1000, PEAK_RATE_ELAPSED_CAP_SEC)
      if (elapsed > 0) this.peak = Math.max(this.peak, count / elapsed)
    }
    this.lastEventTime = now
  }

  reset(): void {
    this.peak = 0
    this.lastEventTime = null
  }
}
