// src/console/scripts/userConsole.ts
// LiveConsole のユーザー操作画面で使う、並び替え・絞り込み・集計 (純粋関数)
import type { UserListItemType, UserStatsUpdateType } from '@/types/api'
import type { DaisyUIColorType } from '@/types/core'

export type UserSortKey = 'recent' | 'score' | 'order' | 'name'
export type TeamFilter = 'all' | 'none' | DaisyUIColorType

export const userSortLabels: Record<UserSortKey, string> = {
  recent: 'コメントが新しい順',
  score: '得点が高い順',
  order: '席順',
  name: '名前順',
}

const byName = (a: UserListItemType, b: UserListItemType) => a.userName.localeCompare(b.userName, 'ja')

/**
 * 並び替え (元の配列は変えない)
 * - recent: 最後のコメントが新しい順。コメントしていないユーザー (手動追加) は最後
 * - order: 席順の小さい順。席順が未設定のユーザーは最後
 */
export function sortUsers(users: UserListItemType[], key: UserSortKey): UserListItemType[] {
  const list = [...users]
  switch (key) {
    case 'recent':
      return list.sort((a, b) => b.lastCommentAt - a.lastCommentAt || byName(a, b))
    case 'score':
      return list.sort((a, b) => b.score - a.score || byName(a, b))
    case 'order':
      return list.sort((a, b) => (a.order ?? Infinity) - (b.order ?? Infinity) || byName(a, b))
    case 'name':
      return list.sort(byName)
  }
}

/**
 * 名前 (または userId) の部分一致と、チームで絞り込む
 */
export function filterUsers(users: UserListItemType[], options: { query: string; team: TeamFilter }): UserListItemType[] {
  const query = options.query.trim().toLowerCase()
  return users.filter((user) => {
    if (options.team === 'none' && user.team !== null) return false
    if (options.team !== 'all' && options.team !== 'none' && user.team !== options.team) return false
    return query === '' || user.userName.toLowerCase().includes(query) || user.userId.toLowerCase().includes(query)
  })
}

export interface TeamTotal {
  team: DaisyUIColorType
  totalScore: number
  memberCount: number
}

/**
 * チームごとの合計得点 (メンバーがいるチームだけ。合計が高い順)
 */
export function buildTeamTotals(users: UserListItemType[]): TeamTotal[] {
  const map = new Map<DaisyUIColorType, TeamTotal>()
  for (const user of users) {
    if (user.team === null) continue
    const total = map.get(user.team) ?? { team: user.team, totalScore: 0, memberCount: 0 }
    total.totalScore += user.score
    total.memberCount += 1
    map.set(user.team, total)
  }
  return [...map.values()].sort((a, b) => b.totalScore - a.totalScore || a.team.localeCompare(b.team))
}

/**
 * いまの並びを、席順 (1, 2, 3, ...) として保存するための更新
 */
export function buildOrderUpdates(users: UserListItemType[]): UserStatsUpdateType[] {
  return users.map((user, index) => ({ userId: user.userId, set: { order: index + 1 } }))
}

/**
 * 席順を外すための更新 (order 0 = 席順なし)。席順が設定されているユーザーだけが対象
 */
export function buildClearOrderUpdates(users: UserListItemType[]): UserStatsUpdateType[] {
  return users.filter((user) => user.order !== null).map((user) => ({ userId: user.userId, set: { order: 0 } }))
}

/**
 * update-user-stats は 1回で最大200ユーザー。それを超える分を分ける
 */
export function chunkUpdates<T>(updates: T[], size = 200): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < updates.length; i += size) chunks.push(updates.slice(i, i + size))
  return chunks
}

/**
 * チーム色の見た目。Tailwind がクラス名を見つけられるよう、文字列のまま書いておく
 */
export const TEAM_STYLE: Record<DaisyUIColorType, { solid: string; label: string }> = {
  primary: { solid: 'bg-primary text-primary-content', label: 'primary' },
  secondary: { solid: 'bg-secondary text-secondary-content', label: 'secondary' },
  accent: { solid: 'bg-accent text-accent-content', label: 'accent' },
  neutral: { solid: 'bg-neutral text-neutral-content', label: 'neutral' },
  info: { solid: 'bg-info text-info-content', label: 'info' },
  success: { solid: 'bg-success text-success-content', label: 'success' },
  warning: { solid: 'bg-warning text-warning-content', label: 'warning' },
  error: { solid: 'bg-error text-error-content', label: 'error' },
}
