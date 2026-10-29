// src/ui/UserBoard/scripts/boardData.test.ts
import { describe, expect, it } from 'vitest'
import type { UserStatsRecord } from '@/types/api'
import { UserBoardSchema } from '@/types/ui'
import { buildPreviewUsers, buildRanking, buildTeamBars } from './boardData'

describe('UserBoardSchema', () => {
  it('component の既定値は ranking。不正な値も ranking に戻す', () => {
    expect(UserBoardSchema.parse({}).component).toBe('ranking')
    expect(UserBoardSchema.parse({ component: 'seats' }).component).toBe('ranking')
    expect(UserBoardSchema.parse({ component: 'teamScore' }).component).toBe('teamScore')
  })
})

describe('boardData', () => {
  const users: UserStatsRecord[] = buildPreviewUsers()

  it('ranking: 得点の高い順、limit で件数を絞る', () => {
    const rows = buildRanking(users, 3)
    expect(rows.map((r) => r.rank)).toEqual([1, 2, 3])
    expect(rows[0].user.score).toBeGreaterThan(rows[1].user.score)
  })

  it('team: チームの合計が高い順 (チームなしは含めない)', () => {
    const bars = buildTeamBars(users)
    expect(bars.map((b) => b.team).sort()).toEqual(['error', 'info', 'success'])
    expect(bars[0].ratio).toBe(1)
    expect(bars.reduce((sum, b) => sum + b.memberCount, 0)).toBe(7)
  })
})
