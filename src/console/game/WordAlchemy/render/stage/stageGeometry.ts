// src/console/game/WordAlchemy/render/stage/stageGeometry.ts
// 盤面の寸法・鍋の位置の定数と、座標まわりの補助 (純粋関数)。WordAlchemyStage.ts から分離した
import { CELL_PX, GRID_COLS, GRID_ROWS, POT_COL, POT_ROW, POT_SIZE } from '../../scripts/wordAlchemyConstants'

export const BOARD_W = GRID_COLS * CELL_PX
export const BOARD_H = GRID_ROWS * CELL_PX
export const POT_CENTER = { x: (POT_COL + POT_SIZE / 2) * CELL_PX, y: (POT_ROW + POT_SIZE / 2) * CELL_PX }
export const POT_TOP = { x: POT_CENTER.x, y: POT_ROW * CELL_PX - 4 }

export const cellCenter = (col: number, row: number) => ({ x: (col + 0.5) * CELL_PX, y: (row + 0.5) * CELL_PX })

export const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))
/** 色相 0〜360・彩度・明るさ 0〜100 → RGB (0〜255) */
export const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
  const sat = s / 100
  const light = l / 100
  const k = (n: number) => (n + h / 30) % 12
  const a = sat * Math.min(light, 1 - light)
  const f = (n: number) => Math.round(255 * (light - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))))
  return [f(0), f(8), f(4)]
}
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t
export const inGrid = (col: number, row: number) => col >= 0 && row >= 0 && col < GRID_COLS && row < GRID_ROWS
/** 外周の 1 マス (縁)。主人公の通り道で、ことばは入れない (押し込まれたことばは、ここで消える) */
export const isRing = (col: number, row: number) =>
  col === 0 || row === 0 || col === GRID_COLS - 1 || row === GRID_ROWS - 1
export const inPot = (col: number, row: number) =>
  col >= POT_COL && col < POT_COL + POT_SIZE && row >= POT_ROW && row < POT_ROW + POT_SIZE
/** 入力欄 (テキストボックスなど) にフォーカスがあれば true。キー操作をゲームに取られないようにする */
export const isTyping = (target: EventTarget | null) =>
  target instanceof HTMLElement &&
  (target.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName))
