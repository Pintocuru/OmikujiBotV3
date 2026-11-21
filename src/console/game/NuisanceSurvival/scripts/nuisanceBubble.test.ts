// src/console/game/NuisanceSurvival/scripts/nuisanceBubble.test.ts
import { describe, expect, it } from 'vitest'
import { bubbleLabel, pickBubbleCenter } from './nuisanceBubble'
import { BUBBLE_MAX_CHARS, BUBBLE_SPREAD_CELLS, CELL_PX } from './nuisanceConstants'
import { createRng } from './rng'

describe('bubbleLabel', () => {
  it('コメントを出す。空なら名前。長ければ省略する', () => {
    expect(bubbleLabel({ userName: 'a', comment: ' こんにちは ' })).toBe('こんにちは')
    expect(bubbleLabel({ userName: '名前', comment: '' })).toBe('名前')
    const long = bubbleLabel({ userName: 'a', comment: 'あ'.repeat(100) })
    expect(Array.from(long)).toHaveLength(BUBBLE_MAX_CHARS + 1)
    expect(long.endsWith('…')).toBe(true)
  })
})

describe('pickBubbleCenter', () => {
  const grid = { cols: 11, rows: 8 }
  it('主人公のまわりに出て、盤面の外には出ない', () => {
    const rng = createRng(3)
    for (let i = 0; i < 200; i++) {
      const hero = { col: i % grid.cols, row: i % grid.rows }
      const { x, y } = pickBubbleCenter(hero, grid, rng)
      expect(x).toBeGreaterThanOrEqual(0)
      expect(x).toBeLessThanOrEqual(grid.cols * CELL_PX)
      expect(y).toBeGreaterThanOrEqual(0)
      expect(y).toBeLessThanOrEqual(grid.rows * CELL_PX)
      expect(Math.abs(x - (hero.col + 0.5) * CELL_PX)).toBeLessThanOrEqual(BUBBLE_SPREAD_CELLS * CELL_PX + 1e-6)
    }
  })
})
