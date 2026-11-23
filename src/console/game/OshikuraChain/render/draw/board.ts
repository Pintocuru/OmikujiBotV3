// src/console/game/OshikuraChain/render/draw/board.ts
// 盤面の背景とマス目
import { CELL_PX } from '../../scripts/nuisanceConstants'
import type { GridSize } from '../../scripts/nuisanceEngine'

/** 盤面の背景色 (宇宙の暗い青) */
export const BOARD_BACKGROUND = '#0b1022'

export const drawBoard = (ctx: CanvasRenderingContext2D, grid: GridSize, width: number, height: number): void => {
  ctx.fillStyle = BOARD_BACKGROUND
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let c = 0; c <= grid.cols; c++) {
    ctx.moveTo(c * CELL_PX + 0.5, 0)
    ctx.lineTo(c * CELL_PX + 0.5, height)
  }
  for (let r = 0; r <= grid.rows; r++) {
    ctx.moveTo(0, r * CELL_PX + 0.5)
    ctx.lineTo(width, r * CELL_PX + 0.5)
  }
  ctx.stroke()
}
