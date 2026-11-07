// src/generator/stores/ReactionManager/ReactionTotals.ts
import { reactionKeys } from '@/types/OmikujiData'
import type { YoutubeReactionType } from '@/types/OmikujiData'
import { REACTION_HISTORY_MAX } from '@/generator/GeneratorConstants'

export class ReactionTotals {
  private history: { timestamp: number; type: YoutubeReactionType }[] = []
  private total: Record<YoutubeReactionType, number> = Object.fromEntries(reactionKeys.map((k) => [k, 0]))

  add(reactions: Record<string, number>, now: number): number {
    let sum = 0
    for (const type in reactions) {
      const count = reactions[type]
      sum += count
      if (this.total[type as YoutubeReactionType] !== undefined) {
        const reactionType = type as YoutubeReactionType
        this.total[reactionType] += count
        for (let i = 0; i < count; i++) this.history.push({ timestamp: now, type: reactionType })
      }
    }
    if (this.history.length > REACTION_HISTORY_MAX) {
      this.history.splice(0, this.history.length - REACTION_HISTORY_MAX)
    }
    return sum
  }

  getTotal(types: YoutubeReactionType[]): number {
    return types.reduce((acc, t) => acc + this.total[t], 0)
  }

  getGrandTotal(): number {
    return Object.values(this.total).reduce((a, b) => a + b, 0)
  }

  getHistory() {
    return [...this.history]
  }

  reset(): void {
    this.history = []
    for (const key in this.total) this.total[key as YoutubeReactionType] = 0
  }
}
