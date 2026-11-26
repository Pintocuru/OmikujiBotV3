// src/console/control/Amidakuji/scripts/trace.ts
// 経路の進み具合 (高さ y) から、描画する折れ線と先端の位置を求める純関数
// y は 0 (上端) 〜 rowCount (下端) の行数。全員が同じ y で進めば、全員が同時に着く
import { RUNG_CROSS_ROWS } from './amidakujiConstants'
import type { TracePath } from './ladder'

export type Crossing = { row: number; from: number; to: number }
export type ProgressPoint = { col: number; row: number }

/** 経路が横線を渡る所を、上から順に取り出す */
export const crossingsOf = (path: TracePath): Crossing[] => {
  const result: Crossing[] = []
  const steps = path.steps
  for (let i = 1; i < steps.length; i++) {
    if (steps[i].row === steps[i - 1].row && steps[i].col !== steps[i - 1].col) {
      result.push({ row: steps[i].row, from: steps[i - 1].col, to: steps[i].col })
    }
  }
  return result
}

/**
 * 上端から高さ y までの折れ線の点列。最後の点が、先端の位置。
 * 横線は、その高さを中心に RUNG_CROSS_ROWS の間で渡る (col は小数になる)。
 */
export const polylineUpTo = (path: TracePath, y: number, rowCount: number): ProgressPoint[] => {
  const limit = Math.min(Math.max(y, 0), rowCount)
  const half = RUNG_CROSS_ROWS / 2
  const points: ProgressPoint[] = [{ col: path.startCol, row: 0 }]
  let col = path.startCol

  for (const crossing of crossingsOf(path)) {
    const enter = crossing.row - half
    const leave = crossing.row + half
    if (limit <= enter) break
    points.push({ col, row: enter })
    if (limit >= leave) {
      col = crossing.to
      points.push({ col, row: leave })
    } else {
      const t = (limit - enter) / (leave - enter)
      points.push({ col: crossing.from + (crossing.to - crossing.from) * t, row: limit })
      return points
    }
  }

  if (points[points.length - 1].row < limit) points.push({ col, row: limit })
  return points
}

/** 高さ y での、先端の位置 */
export const pointAt = (path: TracePath, y: number, rowCount: number): ProgressPoint => {
  const points = polylineUpTo(path, y, rowCount)
  return points[points.length - 1]
}
