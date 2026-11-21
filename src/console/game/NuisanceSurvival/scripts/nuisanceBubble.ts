// src/console/game/NuisanceSurvival/scripts/nuisanceBubble.ts
// 吹き出し (視界妨害) の純粋関数。見た目だけで、ゲームの進行・当たり判定には影響しない
import { BUBBLE_MAX_CHARS, BUBBLE_SPREAD_CELLS, CELL_PX } from './nuisanceConstants'
import type { GridSize } from './nuisanceEngine'
import type { Rng } from './rng'

/** コメント 1 件ぶんの吹き出しの依頼 */
export type CommentBubble = {
  userName: string
  comment: string
}

/** 吹き出しに出す文字。コメントが空 (ギフトなど) なら、名前を出す。長ければ省略する */
export const bubbleLabel = (bubble: CommentBubble): string => {
  const text = (bubble.comment.trim() || bubble.userName.trim()).replace(/\s+/g, ' ')
  const chars = Array.from(text)
  return chars.length > BUBBLE_MAX_CHARS ? `${chars.slice(0, BUBBLE_MAX_CHARS).join('')}…` : text
}

/** 吹き出しの中心 (px)。主人公のまわりにばらけて、盤面の外には出ない */
export const pickBubbleCenter = (
  hero: { col: number; row: number },
  grid: GridSize,
  rng: Rng
): { x: number; y: number } => {
  const spread = BUBBLE_SPREAD_CELLS * CELL_PX
  const x = (hero.col + 0.5) * CELL_PX + (rng() * 2 - 1) * spread
  const y = (hero.row + 0.5) * CELL_PX + (rng() * 2 - 1) * spread
  return {
    x: Math.min(grid.cols * CELL_PX, Math.max(0, x)),
    y: Math.min(grid.rows * CELL_PX, Math.max(0, y)),
  }
}
