// src/types/generator/stores/ReactionManager.ts

export interface BurstState {
  level: number // 現在のバーストレベル (0〜3)
  levelUpCount: number // 現在レベルに入ってから累積した押数
  peakRate: number // 観測した最大レート（押/秒）
  lastEventTime: number | null // 最後にリアクションを受け取った時刻(ms)
  reachedLevel: number // レベルアップ時にセット（burstReach 消費用）。未消費=-1以外
  droppedLevel: number // レベルダウン時にセット（burstDrop 消費用）。未消費=-1以外
  sustainCount: number // レベル維持中の累積押数（burstSustain 消費用）
}

/** バーストレベル変化コールバック */
export type BurstLevelChangeCallback = (newLevel: number, prevLevel: number) => void

export interface ReactionStatsManagerType {
  record(reactions: Record<string, number>): void
  getTotal(types: string[]): number
  getGrandTotal(): number
  getBurstState(): BurstState
  decrementBurstLevel(): number
  onBurstLevelChange(callback: BurstLevelChangeCallback): () => void
  reset(): void
  getHistory(): { timestamp: number; type: string }[]
  consumeReachedLevel(): void
  consumeDroppedLevel(): void
  resetSustainCount(): void
}
