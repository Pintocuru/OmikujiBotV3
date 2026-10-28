// src/console/types/ConsoleStatus.ts
import { DaisyUIColorType } from '@/types/core'

// ?
export type ConsoleStatus = 'loading' | 'online' | 'offline' | 'error'

// ?
export type RankingSortOrder = 'high' | 'low' | 'new'

// ?
export type UserSortKey = 'recent' | 'score' | 'order' | 'name'

// ?
export type TeamFilter = 'all' | 'none' | DaisyUIColorType

// チームの数。0 は「チーム区分なし」(チームの表示を OFF にする)。1チームは区分にならないので、2〜8
export const teamCounts = [0, 2, 3, 4, 5, 6, 7, 8] as const
export type TeamCountType = (typeof teamCounts)[number]

// ?
export interface RankingRow {
  rank: number
  logId: string
  userId: string
  userName: string
  score: number
  label: string // 表示用の得点 (保存されていなければ score を文字にしたもの)
  createdAt: number
}

// ?
export interface TeamTotal {
  team: DaisyUIColorType
  totalScore: number
  memberCount: number
}

/**
 * あとでmaps に切り出すもの
 */
// ?
export const userSortLabels: Record<UserSortKey, string> = {
  recent: 'コメントが新しい順',
  score: '得点が高い順',
  order: '席順',
  name: '名前順',
}
