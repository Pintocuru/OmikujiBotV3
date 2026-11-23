// src/console/game/OshikuraChain/render/draw/obstacle.ts
// ギフト障害物
import type { Obstacle } from '../../scripts/nuisanceEngine'
import { formatObstaclePrice, obstacleColorOf } from '../../scripts/nuisanceObstacle'

export const drawObstacle = (ctx: CanvasRenderingContext2D, o: Obstacle, w: number): void => {
  const color = obstacleColorOf(o.price)
  ctx.fillStyle = color.background
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 4
  ctx.beginPath()
  ctx.roundRect(3, 3, w - 6, w - 6, 10)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = color.text
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `bold ${Math.round(14 + o.size * 4)}px sans-serif`
  ctx.fillText(formatObstaclePrice(o.price), w / 2, w / 2)
}
