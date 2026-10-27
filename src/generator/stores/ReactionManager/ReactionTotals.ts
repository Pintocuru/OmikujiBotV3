// src/generator/stores/ReactionManager/ReactionTotals.ts
import { reactionKeys } from '@/types/OmikujiData'

/** history の保持上限(配信が長いと無制限に増えるため、古いものから捨てる) */
const MAX_HISTORY = 5000

export class ReactionTotals {
  private history: { timestamp: number; type: string }[] = []
  private total: Record<string, number> = Object.fromEntries(reactionKeys.map((k) => [k, 0]))

  add(reactions: Record<string, number>, now: number): number {
    let sum = 0
    for (const type in reactions) {
      const count = reactions[type]
      sum += count
      if (this.total[type] !== undefined) this.total[type] += count
      for (let i = 0; i < count; i++) this.history.push({ timestamp: now, type })
    }
    if (this.history.length > MAX_HISTORY) this.history.splice(0, this.history.length - MAX_HISTORY)
    return sum
  }

  getTotal(types: string[]): number {
    return types.reduce((acc, t) => acc + (this.total[t] ?? 0), 0)
  }

  getGrandTotal(): number {
    return Object.values(this.total).reduce((a, b) => a + b, 0)
  }

  getHistory() {
    return [...this.history]
  }

  reset(): void {
    this.history = []
    for (const key in this.total) this.total[key] = 0
  }
}
