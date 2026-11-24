// src/console/game/WordAlchemy/render/draw.ts
// 盤面・主人公・ことば・鍋の絵 (Canvas 2D。素材が入るまでの仮の見た目)
import { CELL_PX, GRID_COLS, GRID_ROWS, POT_INGREDIENTS, POT_SIZE } from '../scripts/wordAlchemyConstants'

/** 盤面の背景色 (工房の暗い茶色) */
export const BOARD_BACKGROUND = '#1c1511'

export const drawBoard = (ctx: CanvasRenderingContext2D, width: number, height: number): void => {
  ctx.fillStyle = BOARD_BACKGROUND
  ctx.fillRect(0, 0, width, height)
  ctx.strokeStyle = 'rgba(255,255,255,0.07)'
  ctx.lineWidth = 1
  ctx.beginPath()
  for (let c = 0; c <= GRID_COLS; c++) {
    ctx.moveTo(c * CELL_PX + 0.5, 0)
    ctx.lineTo(c * CELL_PX + 0.5, height)
  }
  for (let r = 0; r <= GRID_ROWS; r++) {
    ctx.moveTo(0, r * CELL_PX + 0.5)
    ctx.lineTo(width, r * CELL_PX + 0.5)
  }
  ctx.stroke()
}

/** 主人公: 青い丸に、とんがり帽子 */
export const drawHero = (ctx: CanvasRenderingContext2D): void => {
  const c = CELL_PX / 2
  ctx.fillStyle = '#4f8cff'
  ctx.beginPath()
  ctx.arc(c, c + 4, 20, 0, Math.PI * 2)
  ctx.fill()
  ctx.fillStyle = '#2b3a8c'
  ctx.beginPath()
  ctx.moveTo(c - 18, c - 6)
  ctx.lineTo(c, c - 30)
  ctx.lineTo(c + 18, c - 6)
  ctx.closePath()
  ctx.fill()
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(c - 7, c + 4, 3, 0, Math.PI * 2)
  ctx.arc(c + 7, c + 4, 3, 0, Math.PI * 2)
  ctx.fill()
}

/** ことば: 白い札に、コメントの一部を 2 行まで書く (1 マスに収まるよう、半分ずつで折り返す) */
export const drawWord = (ctx: CanvasRenderingContext2D, text: string): void => {
  const size = CELL_PX - 6
  const offset = (CELL_PX - size) / 2
  ctx.fillStyle = '#ffffff'
  ctx.strokeStyle = 'rgba(0,0,0,0.25)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.roundRect(offset, offset, size, size, 8)
  ctx.fill()
  ctx.stroke()
  const chars = Array.from(text)
  const half = Math.ceil(chars.length / 2)
  const lines = chars.length <= 3 ? [text] : [chars.slice(0, half).join(''), chars.slice(half).join('')]
  ctx.fillStyle = '#222222'
  ctx.font = 'bold 18px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  lines.forEach((line, i) =>
    ctx.fillText(line, CELL_PX / 2, CELL_PX / 2 + 2 + (i - (lines.length - 1) / 2) * 22, size - 6)
  )
}

/** 鍋: 2 × 2 マス。材料の数 (●○○) を出す。煮込み中は緑色に泡立つ */
export const drawPot = (ctx: CanvasRenderingContext2D, count: number, brewing: boolean, clock: number): void => {
  const size = POT_SIZE * CELL_PX
  ctx.fillStyle = '#3a2f2a'
  ctx.beginPath()
  ctx.roundRect(6, size * 0.28, size - 12, size * 0.66, 22)
  ctx.fill()
  ctx.fillStyle = brewing ? '#5fd35f' : '#6b5a4e'
  ctx.beginPath()
  ctx.ellipse(size / 2, size * 0.34, size * 0.4, size * 0.12, 0, 0, Math.PI * 2)
  ctx.fill()
  if (brewing) {
    ctx.fillStyle = 'rgba(255,255,255,0.7)'
    for (let i = 0; i < 4; i++) {
      const phase = (clock * 1.5 + i * 0.25) % 1
      ctx.beginPath()
      ctx.arc(size * (0.3 + i * 0.13), size * (0.34 - phase * 0.2), 4 * (1 - phase) + 1, 0, Math.PI * 2)
      ctx.fill()
    }
  }
  ctx.font = 'bold 20px sans-serif'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#ffe9a8'
  ctx.fillText(brewing ? '煮込み中…' : '●'.repeat(count) + '○'.repeat(POT_INGREDIENTS - count), size / 2, size * 0.62)
}
