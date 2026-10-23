// src/ui/UserBoard/scripts/boardData.ts
// ユーザーボードの表示データを作る (純粋関数)
import type { UserStatsRecord } from '@/types/api'
import type { DaisyUIColorType } from '@/types/core'

const byName = (a: UserStatsRecord, b: UserStatsRecord) => a.userName.localeCompare(b.userName, 'ja')

export interface RankingRow {
  rank: number
  user: UserStatsRecord
}

/**
 * 個人ランキング: 得点が 0 でないユーザーを、得点の高い順に並べる
 * 同じ得点は同じ順位にする (1, 1, 3, ...)
 */
export function buildRanking(users: UserStatsRecord[], limit: number): RankingRow[] {
  const sorted = users.filter((u) => u.score !== 0).sort((a, b) => b.score - a.score || byName(a, b))

  const rows: RankingRow[] = []
  sorted.forEach((user, index) => {
    const previous = rows[index - 1]
    rows.push({ rank: previous && previous.user.score === user.score ? previous.rank : index + 1, user })
  })
  return rows.slice(0, limit)
}

export interface TeamBar {
  team: DaisyUIColorType
  totalScore: number
  memberCount: number
  ratio: number // 一番高いチームを 1 としたときの比率 (バーの長さ)。0 〜 1
}

/**
 * チーム合計: チームが割り当てられたユーザーの得点を、チームごとに足す (合計が高い順)
 * マイナスの合計や、0 点のチームも、バーが見えるよう ratio の下限を設ける
 */
export function buildTeamBars(users: UserStatsRecord[]): TeamBar[] {
  const map = new Map<DaisyUIColorType, { totalScore: number; memberCount: number }>()
  for (const user of users) {
    if (user.team === null) continue
    const total = map.get(user.team) ?? { totalScore: 0, memberCount: 0 }
    total.totalScore += user.score
    total.memberCount += 1
    map.set(user.team, total)
  }

  const bars = [...map].map(([team, total]) => ({ team, ...total }))
  bars.sort((a, b) => b.totalScore - a.totalScore || a.team.localeCompare(b.team))

  const max = Math.max(...bars.map((b) => b.totalScore), 1)
  return bars.map((bar) => ({ ...bar, ratio: Math.max(Math.max(bar.totalScore, 0) / max, 0.03) }))
}

export interface SeatRow {
  order: number
  user: UserStatsRecord
}

/**
 * 席順: 席順が設定されている (order が 1 以上) ユーザーを、席順の小さい順に並べる
 */
export function buildSeats(users: UserStatsRecord[], limit: number): SeatRow[] {
  return users
    .filter((u): u is UserStatsRecord & { order: number } => typeof u.order === 'number' && u.order > 0)
    .sort((a, b) => a.order - b.order || byName(a, b))
    .map((user) => ({ order: user.order, user }))
    .slice(0, limit)
}

/**
 * 設定画面のプレビュー用のダミー (実際の配信では使わない)
 */
export function buildPreviewUsers(): UserStatsRecord[] {
  const teams: (DaisyUIColorType | null)[] = ['info', 'error', 'info', 'success', 'error', 'info', null, 'success']
  const names = ['ひなた', 'さくら', 'あおい', 'ゆうと', 'はると', 'みお', 'そうた', 'りん']
  return names.map((userName, index) => ({
    userId: `preview-${index}`,
    userName,
    profileImage: '',
    timestamp: 0,
    tc: 1,
    no: 1,
    isSyoken: false,
    team: teams[index],
    score: (names.length - index) * 10,
    order: index + 1,
    tags: [],
    badges: [],
    giftPrice: 0,
    lastVisit: 0,
  }))
}
