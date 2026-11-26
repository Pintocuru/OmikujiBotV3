// src/console/control/Amidakuji/scripts/rungs.ts
// 横線の掃除 (人数や行数が変わったあとの、範囲外の横線の除去)
import type { Rung } from './ladder'

/** 盤面の範囲 (0 <= col < colCount - 1, 0 <= row < rowCount) に収まる横線だけを残す */
export const pruneRungs = (rungs: readonly Rung[], colCount: number, rowCount: number): Rung[] => {
  return rungs.filter((r) => r.col >= 0 && r.col < colCount - 1 && r.row >= 0 && r.row < rowCount)
}
