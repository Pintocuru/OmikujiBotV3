// src/console/game/NuisanceSurvival/scripts/nuisanceRecord.test.ts
import { describe, expect, it } from 'vitest'
import { createDefaultConfig } from './nuisanceConfig'
import { PLAYER_USER_ID } from './nuisanceConstants'
import { NO_INPUT } from './heroInput'
import { advance, createGame, type GameState } from './nuisanceEngine'
import { buildDamageLogs, buildSurvivalLog, formatClock, formatSurvival } from './nuisanceRecord'
import { createRng } from './rng'

const finished = (): GameState => {
  const config = { ...createDefaultConfig(), startLife: 30, maxNuisances: 100, drainMultiplier: 4 }
  const spawns = ['a', 'a', 'b', 'c'].map((userId) => ({
    atSeconds: 0,
    userId,
    userName: `n-${userId}`,
    profileImage: '',
  }))
  return advance(createGame(config), config, 300, NO_INPUT, spawns, createRng(1)).state
}

describe('formatClock / formatSurvival', () => {
  it('mm:ss と、「分秒」の表示', () => {
    expect(formatClock(0)).toBe('00:00')
    expect(formatClock(65.9)).toBe('01:05')
    expect(formatClock(3725)).toBe('62:05')
    expect(formatSurvival(45.4)).toBe('45秒')
    expect(formatSurvival(754)).toBe('12分34秒')
  })
})

describe('buildDamageLogs', () => {
  it('出現したユーザー全員ぶんを、ダメージの多い順に 1 件ずつ作る。同じゲームの再送は同じ内容', () => {
    const state = finished()
    const logs = buildDamageLogs(state, 'run-x', 7000)
    expect(logs).toHaveLength(3)
    expect(new Set(logs.map((l) => l.id)).size).toBe(3)
    expect(logs.every((l) => l.id.startsWith('run-x:') && l.createdAt === 7000)).toBe(true)
    for (let i = 1; i < logs.length; i++) expect(logs[i - 1].score).toBeGreaterThanOrEqual(logs[i].score)
    expect(logs.find((l) => l.userId === 'a')?.item).toMatch(/ダメージ \/ 2体$/)
    expect(buildDamageLogs(state, 'run-x', 7000)).toEqual(logs)
  })
})

describe('buildSurvivalLog', () => {
  it('プレイヤーの固定 ID で、生存秒を score に、表示を item に入れる', () => {
    const state = finished()
    const log = buildSurvivalLog(state, 'run-x', 7000)
    expect(log.userId).toBe(PLAYER_USER_ID)
    expect(log.id).toBe(`run-x:${PLAYER_USER_ID}`)
    expect(log.score).toBeCloseTo(state.endedAt!, 1)
    expect(log.item).toBe(formatSurvival(state.endedAt!))
  })
})
