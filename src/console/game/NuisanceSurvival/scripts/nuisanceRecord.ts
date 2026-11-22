// src/console/game/NuisanceSurvival/scripts/nuisanceRecord.ts
// 結果の表示用の整形と、ゲームログ (GameLog) に残す記録の組み立て (純粋関数)
import type { GameLogType } from '@/types/api'
import { PLAYER_USER_ID, PLAYER_USER_NAME } from './nuisanceConstants'
import { getContributionRanking, type GameState } from './nuisanceEngine'

/** 'mm:ss' (1時間を超えても、分を増やして表示する) */
export const formatClock = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds))
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${pad(Math.floor(total / 60))}:${pad(total % 60)}`
}

/** 得た秒数の表示 (例: 2.5 → '2.5' / 5 → '5' / 12.4 → '12')。10 秒未満は小数 1 桁まで、それ以上は整数 */
export const formatGain = (seconds: number): string => {
  const value = Math.max(0, seconds)
  return value >= 10 ? String(Math.round(value)) : String(Math.round(value * 10) / 10)
}

/** 生存時間の表示 (例: '12分34秒' / '45秒') */
export const formatSurvival = (seconds: number): string => {
  const total = Math.max(0, Math.floor(seconds))
  const minutes = Math.floor(total / 60)
  return minutes > 0 ? `${minutes}分${total % 60}秒` : `${total}秒`
}

/**
 * ユーザーごとの貢献度のログ。アイコンまたはことばが得点につながったユーザー全員ぶんを 1 件ずつ作る
 * - score: その人のアイコン・ことばが生んだ秒数 (四捨五入)
 * - item: 表示用 (例: '38秒 / 3体')
 * - id: ゲームごとの ID + userId。同じゲームを再送しても、サーバーが二重に保存しない
 */
export const buildContributionLogs = (state: GameState, runId: string, createdAt: number = Date.now()): GameLogType[] =>
  getContributionRanking(state)
    .filter((c) => Math.round(c.seconds) > 0)
    .map((c) => ({
      id: `${runId}:${c.userId}`,
      userId: c.userId,
      userName: c.userName,
      score: Math.round(c.seconds),
      item: `${Math.round(c.seconds)}秒 / ${c.spawned}体`,
      createdAt,
    }))

/**
 * ゲーム全体の生存時間のログ (1 件)。プレイヤー (配信者) は、ユーザーリストにいないので固定の ID で残す
 * - score: 生存秒 (小数第1位まで)。自己ベストが、そのまま最長記録になる
 */
export const buildSurvivalLog = (state: GameState, runId: string, createdAt: number = Date.now()): GameLogType => {
  const seconds = state.endedAt ?? state.elapsed
  return {
    id: `${runId}:${PLAYER_USER_ID}`,
    userId: PLAYER_USER_ID,
    userName: PLAYER_USER_NAME,
    score: Math.round(seconds * 10) / 10,
    item: formatSurvival(seconds),
    createdAt,
  }
}
