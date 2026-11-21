// src/console/game/NuisanceSurvival/scripts/nuisanceObstacle.test.ts
import { describe, expect, it } from 'vitest'
import { OBSTACLE_SECONDS, OBSTACLE_SECONDS_MAX } from './nuisanceConstants'
import { formatObstaclePrice, obstacleColorOf, obstacleSecondsOf, obstacleSizeOf } from './nuisanceObstacle'

describe('obstacleSizeOf', () => {
  it('金額が大きいほど大きい。0 円でも置ける', () => {
    expect(obstacleSizeOf(0)).toBe(1)
    expect(obstacleSizeOf(499)).toBe(1)
    expect(obstacleSizeOf(500)).toBe(2)
    expect(obstacleSizeOf(2000)).toBe(3)
    expect(obstacleSizeOf(50000)).toBe(3)
  })
  it('金額が大きいほど長く残る。上限がある', () => {
    expect(obstacleSecondsOf(0)).toBe(OBSTACLE_SECONDS)
    expect(obstacleSecondsOf(5000)).toBeGreaterThan(obstacleSecondsOf(100))
    expect(obstacleSecondsOf(10000)).toBe(OBSTACLE_SECONDS_MAX)
    expect(obstacleSecondsOf(1e6)).toBe(OBSTACLE_SECONDS_MAX)
  })
  it('金額帯で色が変わる', () => {
    expect(obstacleColorOf(100).background).not.toBe(obstacleColorOf(10000).background)
    expect(obstacleColorOf(10000)).toEqual(obstacleColorOf(99999))
  })
  it('金額は円で表示する', () => {
    expect(formatObstaclePrice(1500)).toBe('¥1,500')
  })
})
