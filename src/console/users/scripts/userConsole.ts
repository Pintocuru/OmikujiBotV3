// src/console/users/scripts/userConsole.ts
// LiveConsole のユーザー操作画面で使う、並び替え・絞り込み・集計 (純粋関数)
import { TeamCountType, TeamFilter, TeamTotal, UserSortKey } from '@/console/types'
import { UserListItemType } from '@/types/api'
import { DaisyUIColorType } from '@/types/core'

const byName = (a: UserListItemType, b: UserListItemType) => a.userName.localeCompare(b.userName, 'ja')

// チーム割り当て用の順序
const teamColorOrder: readonly DaisyUIColorType[] = [
  'error',
  'info',
  'warning',
  'success',
  'primary',
  'secondary',
  'accent',
  'neutral',
]

/**
 * 並び替え (元の配列は変えない)
 * - ピン留めしたユーザーは、どの並びでも先頭 (ピン留めの中は、選んだ並び順)
 * - recent: 最後のコメントが新しい順。コメントしていないユーザー (手動追加) は最後
 */
export function sortUsers(users: UserListItemType[], key: UserSortKey): UserListItemType[] {
  const compare = (a: UserListItemType, b: UserListItemType): number => {
    switch (key) {
      case 'recent':
        return b.lastCommentAt - a.lastCommentAt || byName(a, b)
      case 'score':
        return b.score - a.score || byName(a, b)
      case 'name':
        return byName(a, b)
    }
  }
  return [...users].sort((a, b) => Number(b.pinned) - Number(a.pinned) || compare(a, b))
}

/**
 * 名前 (または userId) の部分一致と、チームで絞り込む
 */
export function filterUsers(
  users: UserListItemType[],
  options: { query: string; team: TeamFilter }
): UserListItemType[] {
  const query = options.query.trim().toLowerCase()
  return users.filter((user) => {
    if (options.team === 'none' && user.team !== null) return false
    if (options.team !== 'all' && options.team !== 'none' && user.team !== options.team) return false
    return query === '' || user.userName.toLowerCase().includes(query) || user.userId.toLowerCase().includes(query)
  })
}

/**
 * 使うチーム (チーム色の先頭から count 色)。0 (チーム区分なし) のときは空
 */

export function pickTeams(count: TeamCountType): DaisyUIColorType[] {
  return teamColorOrder.slice(0, count)
}

/**
 * チームごとの合計得点 (メンバーがいるチームだけ。合計が高い順)
 * teams を渡すと、そのチームだけを数える (使っていないチームに割り当て済みのユーザーは、合計に含めない)
 */
export function buildTeamTotals(users: UserListItemType[], teams?: readonly DaisyUIColorType[]): TeamTotal[] {
  const map = new Map<DaisyUIColorType, TeamTotal>()
  for (const user of users) {
    if (user.team === null) continue
    if (teams && !teams.includes(user.team)) continue
    const total = map.get(user.team) ?? { team: user.team, totalScore: 0, memberCount: 0 }
    total.totalScore += user.score
    total.memberCount += 1
    map.set(user.team, total)
  }
  return [...map.values()].sort((a, b) => b.totalScore - a.totalScore || a.team.localeCompare(b.team))
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
export const TEAM_STYLE: Record<DaisyUIColorType, { solid: string }> = {
  primary: { solid: 'bg-primary text-primary-content' },
  secondary: { solid: 'bg-secondary text-secondary-content' },
  accent: { solid: 'bg-accent text-accent-content' },
  neutral: { solid: 'bg-neutral text-neutral-content' },
  info: { solid: 'bg-info text-info-content' },
  success: { solid: 'bg-success text-success-content' },
  warning: { solid: 'bg-warning text-warning-content' },
  error: { solid: 'bg-error text-error-content' },
}

/**
 * チームの初期の名前 (「チーム1」〜「チーム8」)。チーム色の並び順で決まるので、チームの数を変えても名前は変わらない
 */
export function defaultTeamName(team: DaisyUIColorType): string {
  return `チーム${teamColorOrder.indexOf(team) + 1}`
}
