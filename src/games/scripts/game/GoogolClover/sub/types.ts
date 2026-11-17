// src/games/scripts/game/GoogolClover/sub/types.ts
import type { BotMessageRankingType } from '@/types/generator'

/**
 * スロット実行結果
 */
export interface SlotExecutionResult {
  spins: number
  totalMultiplier: number
  failedAt: number
  multipliers: number[]
  state: UserState
}

/** ユーザーの状態 */
export interface UserState {
  funds: number
  exp: number
  successCount: number
  isGoogol: boolean
}

/**
 * ゲーム結果の完全な型定義
 */
export interface GameExecutionResult {
  bubble: string
  rankingMessage: BotMessageRankingType
  shouldDeleteState: boolean
  newState: UserState | null
}
