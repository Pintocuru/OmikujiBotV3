// src/console/game/WordAlchemy/render/draw.ts
// 盤面・主人公・ことば・鍋の絵 (Canvas 2D。素材が入るまでの仮の見た目)
import type { PotLook } from '../maps/WordAlchemyPotMap'
import { CELL_PX, GRID_COLS, GRID_ROWS, POT_INGREDIENTS, POT_SIZE } from '../scripts/wordAlchemyConstants'
import { floorTone, TILE_PX, TILE_STRIDE, wallTileAt } from './boardTiles'

/** 盤面の背景色 (工房の暗い茶色) */
export const BOARD_BACKGROUND = '#1c1511'

/** 床の板の色 (暗めの木。白い札の「ことば」が読みやすいように、明るくしすぎない) */
const FLOOR_PLANKS = ['#4f3a29', '#5a4130', '#46321f'] as const
const PLANKS_PER_CELL = 4

/** 床: 板張り。1 マスを 4 枚の板に分け、色むらと継ぎ目を付ける (素材のタイルには、継ぎ目のない床がないので、色は素材の木に合わせて描く) */
const drawFloor = (ctx: CanvasRenderingContext2D): void => {
  const plankH = CELL_PX / PLANKS_PER_CELL
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      for (let plank = 0; plank < PLANKS_PER_CELL; plank++) {
        const tone = floorTone(col, row, plank)
        const x = col * CELL_PX
        const y = row * CELL_PX + plank * plankH
        ctx.fillStyle = FLOOR_PLANKS[Math.floor(tone * FLOOR_PLANKS.length)]
        ctx.fillRect(x, y, CELL_PX, plankH)
        ctx.fillStyle = 'rgba(0,0,0,0.28)'
        ctx.fillRect(x, y + plankH - 2, CELL_PX, 2)
        // 板の継ぎ目 (縦。横の継ぎ目より薄くして、床が細かく見えすぎないようにする)
        ctx.fillStyle = 'rgba(0,0,0,0.16)'
        ctx.fillRect(x + Math.floor(tone * (CELL_PX - 4)) + 2, y, 2, plankH - 2)
      }
    }
  }
}

/** 壁 (外周): 素材のタイルを置く。盤面の背景として、少し暗くする */
const drawWalls = (ctx: CanvasRenderingContext2D, sheet: HTMLImageElement): void => {
  ctx.imageSmoothingEnabled = false
  for (let row = 0; row < GRID_ROWS; row++) {
    for (let col = 0; col < GRID_COLS; col++) {
      const tile = wallTileAt(col, row)
      if (!tile) continue
      ctx.drawImage(
        sheet,
        tile.col * TILE_STRIDE,
        tile.row * TILE_STRIDE,
        TILE_PX,
        TILE_PX,
        col * CELL_PX,
        row * CELL_PX,
        CELL_PX,
        CELL_PX
      )
      ctx.fillStyle = 'rgba(12,8,4,0.3)'
      ctx.fillRect(col * CELL_PX, row * CELL_PX, CELL_PX, CELL_PX)
    }
  }
}

/** 盤面。sheet があれば、工房 (木の床と、棚・カウンターの壁)。なければ、仮の見た目 (暗い茶色の面) */
export const drawBoard = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  sheet: HTMLImageElement | null = null
): void => {
  ctx.fillStyle = BOARD_BACKGROUND
  ctx.fillRect(0, 0, width, height)
  if (sheet) {
    drawFloor(ctx)
    drawWalls(ctx, sheet)
  } else {
    // 縁 (外周 1 マス) は、ことばが入ると消える場所。少し明るくして、見分けがつくようにする
    ctx.fillStyle = 'rgba(255,255,255,0.05)'
    ctx.fillRect(0, 0, width, CELL_PX)
    ctx.fillRect(0, height - CELL_PX, width, CELL_PX)
    ctx.fillRect(0, CELL_PX, CELL_PX, height - 2 * CELL_PX)
    ctx.fillRect(width - CELL_PX, CELL_PX, CELL_PX, height - 2 * CELL_PX)
  }
  ctx.strokeStyle = sheet ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.07)'
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

/** 鍋の既定の見た目 (look を渡さないとき) */
const DEFAULT_POT_LOOK: PotLook = { body: '#3a2f2a', liquid: '#6b5a4e' }

/** 鍋: 2 × 2 マス。材料の数 (●○○) を出す。煮込み中は緑色に泡立つ。look で、鍋ごとに色を変える (暗い鍋も、床に埋もれないように縁取る) */
export const drawPot = (
  ctx: CanvasRenderingContext2D,
  count: number,
  brewing: boolean,
  clock: number,
  look: PotLook = DEFAULT_POT_LOOK
): void => {
  const size = POT_SIZE * CELL_PX
  ctx.fillStyle = look.body
  ctx.strokeStyle = 'rgba(255,255,255,0.35)'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.roundRect(6, size * 0.28, size - 12, size * 0.66, 22)
  ctx.fill()
  ctx.stroke()
  ctx.fillStyle = brewing ? '#5fd35f' : look.liquid
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
