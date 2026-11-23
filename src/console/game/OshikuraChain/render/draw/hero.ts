// src/console/game/OshikuraChain/render/draw/hero.ts
// 主人公
import { CELL_PX } from '../../scripts/nuisanceConstants'

export const drawHero = (ctx: CanvasRenderingContext2D): void => {
  const cx = CELL_PX / 2
  const cy = CELL_PX / 2
  const radius = CELL_PX * 0.34
  ctx.fillStyle = '#f5f7fa'
  ctx.strokeStyle = '#2d6cdf'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.arc(cx, cy, radius, 0, Math.PI * 2)
  ctx.fill()
  ctx.stroke()
  // 目
  ctx.fillStyle = '#1b2230'
  ctx.beginPath()
  ctx.arc(cx - radius * 0.35, cy - radius * 0.1, radius * 0.12, 0, Math.PI * 2)
  ctx.arc(cx + radius * 0.35, cy - radius * 0.1, radius * 0.12, 0, Math.PI * 2)
  ctx.fill()
}
