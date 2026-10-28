// src/console/scripts/summarizeState.ts
// 1つの eventKey の GameState から、LiveConsole で表示する形を作る (純粋関数)
import { RankingSortOrder, RankingRow } from '@/console/types'
import { GameLogType, GameStateType } from '@/types/api'

// ?
interface UserRow {
  userId: string
  userName: string
  totalDraws: number
  totalPoints: number
  bestScore: number
  lastPlayedAt: number
}

/**
 * userId → 表示名 (いちばん新しいログの userName を採用。どのログにもなければ userId)
 */
export function resolveUserNames(logs: GameLogType[]): Map<string, string> {
  const latest = new Map<string, { name: string; at: number }>()
  for (const log of logs) {
    if (!log.userName) continue
    const prev = latest.get(log.userId)
    if (!prev || log.createdAt >= prev.at) latest.set(log.userId, { name: log.userName, at: log.createdAt })
  }
  return new Map([...latest].map(([userId, v]) => [userId, v.name]))
}

const nameOf = (names: Map<string, string>, userId: string) => names.get(userId) ?? userId

/**
 * ランキング (high: 高い順 / low: 低い順 / new: 新しい順)
 * unique が true のときは、1ユーザーにつき1件だけ (high / low は自己ベスト、new は最新)
 */
export function buildRanking(
  state: GameStateType,
  options: { sortOrder: RankingSortOrder; unique: boolean; limit?: number }
): RankingRow[] {
  const { sortOrder, unique, limit } = options
  const names = resolveUserNames(state.logs)

  const compare = (a: GameLogType, b: GameLogType): number => {
    if (sortOrder === 'high') return b.score - a.score || b.createdAt - a.createdAt
    if (sortOrder === 'low') return a.score - b.score || b.createdAt - a.createdAt
    return b.createdAt - a.createdAt
  }

  let logs = [...state.logs].sort(compare)
  if (unique) {
    const seen = new Set<string>()
    logs = logs.filter((log) => (seen.has(log.userId) ? false : (seen.add(log.userId), true)))
  }
  if (limit !== undefined) logs = logs.slice(0, limit)

  return logs.map((log, index) => ({
    rank: index + 1,
    logId: log.id,
    userId: log.userId,
    userName: nameOf(names, log.userId),
    score: log.score,
    label: log.item || String(log.score),
    createdAt: log.createdAt,
  }))
}

/**
 * ユーザー別の統計 (累計ポイントの多い順)
 */
export function buildUserRows(state: GameStateType): UserRow[] {
  const names = resolveUserNames(state.logs)
  const lastPlayed = new Map<string, number>()
  for (const log of state.logs) lastPlayed.set(log.userId, Math.max(lastPlayed.get(log.userId) ?? 0, log.createdAt))

  return Object.values(state.userMap)
    .map((stats) => ({
      userId: stats.userId,
      userName: nameOf(names, stats.userId),
      totalDraws: stats.totalDraws,
      totalPoints: stats.totalPoints,
      bestScore: stats.bestScore,
      lastPlayedAt: lastPlayed.get(stats.userId) ?? 0,
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints || b.totalDraws - a.totalDraws)
}

/**
 * ログ一覧 (新しい順)
 */
export function buildLogRows(state: GameStateType): RankingRow[] {
  return buildRanking(state, { sortOrder: 'new', unique: false })
}

/**
 * 配信ID ('20261020-2130') を読みやすくする。形式が違えば、そのまま返す
 */
export function formatStreamId(streamId: string): string {
  const m = /^(\d{4})(\d{2})(\d{2})-(\d{2})(\d{2})$/.exec(streamId)
  return m ? `${m[1]}/${m[2]}/${m[3]} ${m[4]}:${m[5]}` : streamId
}
