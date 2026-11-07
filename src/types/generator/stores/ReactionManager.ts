// src/types/generator/stores/ReactionManager.ts
import type { YoutubeReactionType } from '@/types/OmikujiData'

export interface BurstState {
  level: number // 現在のバーストレベル (0〜3)
  levelUpCount: number // 現在レベルに入ってから累積した押数
  peakRate: number // 観測した最大レート（押/秒）
  lastEventTime: number | null // 最後にリアクションを受け取った時刻(ms)
  reachedLevel: number | null // レベルアップ時にセット（burstReach 消費用）。未消費=null
  droppedLevel: number | null // レベルダウン時にセット（burstDrop 消費用）。未消費=null
  sustainCount: number // レベル維持中の累積押数（burstSustain 消費用）
}

/** バーストレベル変化コールバック */
export type BurstLevelChangeCallback = (newLevel: number, prevLevel: number) => void

export interface ReactionStatsManagerType {
  record(reactions: Record<string, number>): void
  getTotal(types: YoutubeReactionType[]): number
  getGrandTotal(): number
  getBurstState(): BurstState
  decrementBurstLevel(): number
  onBurstLevelChange(callback: BurstLevelChangeCallback): () => void
  reset(): void
  getHistory(): { timestamp: number; type: YoutubeReactionType }[]
  consumeReachedLevel(): void
  consumeDroppedLevel(): void
  resetSustainCount(): void
}
