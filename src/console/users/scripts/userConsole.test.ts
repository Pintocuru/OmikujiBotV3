// src/console/scripts/userConsole.test.ts
import { describe, expect, it } from 'vitest'
import type { UserListItemType } from '@/types/api'
import { buildTeamTotals, pickTeams } from './userConsole'

const user = (userId: string, team: UserListItemType['team'], score: number) =>
  ({ userId, userName: userId, team, score }) as UserListItemType

describe('pickTeams', () => {
  it('0 (チーム区分なし) は空', () => expect(pickTeams(0)).toEqual([]))
  it('チーム色の先頭から count 色', () => expect(pickTeams(2)).toEqual(['primary', 'secondary']))
  it('8 は全チーム色', () => expect(pickTeams(8)).toHaveLength(8))
})

describe('buildTeamTotals', () => {
  const users = [user('a', 'primary', 10), user('b', 'secondary', 5), user('c', 'error', 99), user('d', null, 1)]

  it('teams なしなら、割り当て済みの全チームを数える', () => {
    expect(buildTeamTotals(users).map((t) => t.team)).toEqual(['error', 'primary', 'secondary'])
  })
  it('teams を渡すと、使っていないチームは合計に含めない', () => {
    expect(buildTeamTotals(users, pickTeams(2)).map((t) => t.team)).toEqual(['primary', 'secondary'])
  })
  it('チーム区分なし (空) なら合計は出ない', () => {
    expect(buildTeamTotals(users, pickTeams(0))).toEqual([])
  })
})
