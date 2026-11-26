// src/console/game/WordAlchemy/render/boardTiles.test.ts
import { describe, expect, it } from 'vitest'
import { GRID_COLS, GRID_ROWS } from '../scripts/wordAlchemyConstants'
import { floorTone, wallTileAt } from './boardTiles'

describe('wallTileAt', () => {
  it('外周のマスだけにタイルがあり、内側は床 (null)', () => {
    let ring = 0
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const onRing = col === 0 || row === 0 || col === GRID_COLS - 1 || row === GRID_ROWS - 1
        const tile = wallTileAt(col, row)
        expect(tile === null, `${col},${row}`).toBe(!onRing)
        if (onRing) ring++
      }
    }
    expect(ring).toBe(2 * GRID_COLS + 2 * (GRID_ROWS - 2))
  })
  it('同じマスは、いつも同じタイル。上の壁は、瓶の並ぶ棚 (素材の 12 行目)', () => {
    expect(wallTileAt(3, 0)).toEqual(wallTileAt(3, 0))
    for (let col = 0; col < GRID_COLS; col++) expect(wallTileAt(col, 0)?.row).toBe(12)
  })
  it('タイルの位置は、素材 (27 列 × 18 行) の範囲に収まる', () => {
    for (let row = 0; row < GRID_ROWS; row++) {
      for (let col = 0; col < GRID_COLS; col++) {
        const tile = wallTileAt(col, row)
        if (tile) {
          expect(tile.col).toBeGreaterThanOrEqual(0)
          expect(tile.col).toBeLessThan(27)
          expect(tile.row).toBeGreaterThanOrEqual(0)
          expect(tile.row).toBeLessThan(18)
        }
      }
    }
  })
})

describe('floorTone', () => {
  it('0 以上 1 未満で、同じ入力なら同じ値。マスや板で値が変わる', () => {
    const seen = new Set<number>()
    for (let col = 0; col < GRID_COLS; col++) {
      for (let plank = 0; plank < 4; plank++) {
        const v = floorTone(col, 3, plank)
        expect(v).toBeGreaterThanOrEqual(0)
        expect(v).toBeLessThan(1)
        expect(floorTone(col, 3, plank)).toBe(v)
        seen.add(v)
      }
    }
    expect(seen.size).toBeGreaterThan(10)
  })
})
