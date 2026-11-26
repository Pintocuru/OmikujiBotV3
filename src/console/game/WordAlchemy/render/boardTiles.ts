// src/console/game/WordAlchemy/render/boardTiles.ts
// 盤面の素材 (Kenney「Roguelike Indoors」。CC0 なので、クレジットは必須ではない)。
// 16px のタイルが、1px の間隔で並んでいる (tilesheetInfo.txt)。どのタイルをどこに置くかの決定 (純粋関数) と、読み込みだけを持つ。
// 素材を読み込めなくても、仮の見た目のまま、ゲームは動く
import { getImagePath } from '@/common/AppEnv'
import { GRID_COLS, GRID_ROWS } from '../scripts/wordAlchemyConstants'

/** 実ファイル: assets/images/2026-Q4/WordAlchemy/roguelikeIndoor_transparent.png (実行時 URL では、四半期名を含めない) */
export const TILE_SHEET_PATH = 'WordAlchemy/roguelikeIndoor_transparent.png'
export const TILE_PX = 16
/** タイルの間隔 (タイル 16px + 余白 1px) */
export const TILE_STRIDE = 17

export type TileRef = { col: number; row: number }
const t = (col: number, row: number): TileRef => ({ col, row })

/** 壁 (外周) に使うタイル。キッチンのカウンターと棚 (瓶が並ぶものを多めにして、錬金術の工房らしくする) */
const TOP_WALL: readonly TileRef[] = [
  t(2, 12), t(5, 12), t(1, 12), t(6, 12), t(2, 12), t(4, 12),
  t(1, 12), t(5, 12), t(3, 12), t(6, 12), t(2, 12), t(1, 12),
] // prettier-ignore
const BOTTOM_WALL: readonly TileRef[] = [t(0, 17), t(2, 17), t(1, 17), t(3, 17), t(2, 17), t(7, 17)]
const SIDE_WALL: readonly TileRef[] = [t(0, 16), t(2, 16), t(3, 16), t(2, 16), t(1, 16)]

const isRing = (col: number, row: number) => col === 0 || row === 0 || col === GRID_COLS - 1 || row === GRID_ROWS - 1

/** マス (col, row) の壁のタイル。外周のマスだけ (内側は床なので null)。同じマスなら、いつも同じタイル */
export const wallTileAt = (col: number, row: number): TileRef | null => {
  if (!isRing(col, row)) return null
  if (row === 0) return TOP_WALL[col % TOP_WALL.length]
  if (row === GRID_ROWS - 1) return BOTTOM_WALL[col % BOTTOM_WALL.length]
  return SIDE_WALL[row % SIDE_WALL.length]
}

/** 床の板の色むら (0 以上 1 未満)。マスと板の番号から決める (毎回同じ) */
export const floorTone = (col: number, row: number, plank: number): number => {
  const h = Math.imul(col + 1, 73856093) ^ Math.imul(row + 1, 19349663) ^ Math.imul(plank + 1, 83492791)
  return ((h >>> 0) % 1000) / 1000
}

/**
 * 素材を読み込む。読み込めなかったら null (仮の見た目のまま続ける)。
 * 盤面は WebGL の絵として使うので、別のオリジンから読むとき (開発時) は、CORS で読めることが必要 (読めなければ null)
 */
export const loadTileSheet = (): Promise<HTMLImageElement | null> =>
  new Promise((resolve) => {
    const url = getImagePath(TILE_SHEET_PATH)
    if (!url) return resolve(null)
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.onload = () => resolve(image)
    image.onerror = () => {
      console.warn(`[WordAlchemy] 盤面の素材を読み込めませんでした: ${url}`)
      resolve(null)
    }
    image.src = url
  })
