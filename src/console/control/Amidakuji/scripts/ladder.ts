// src/console/control/Amidakuji/scripts/ladder.ts
// あみだくじの横線モデル・検証・自動生成・経路探索純粋関数

export type LadderPoint = {
  col: number
  row: number
}

/**
 * 横線(Rung)を表す型
 * col: 左側の縦線インデックス (0 <= col < colCount - 1)
 * row: 行インデックス (0 <= row < rowCount)
 * col と col + 1 を結ぶ
 */
export type Rung = {
  col: number
  row: number
}

/** 横線キー ("col:row") */
export const rungKey = (col: number, row: number): string => `${col}:${row}`

/**
 * 横線が有効か (あみだくじの制約を満たしているか)
 * 制約:
 * 1. 範囲内であること (0 <= col < colCount - 1, 0 <= row < rowCount)
 * 2. 同じ行で隣り合う横線がないこと (col - 1 または col + 1 に同じ row の横線が存在しない)
 */
export const canPlaceRung = (
  rungs: readonly Rung[],
  col: number,
  row: number,
  colCount: number,
  rowCount: number
): boolean => {
  if (col < 0 || col >= colCount - 1 || row < 0 || row >= rowCount) {
    return false
  }

  // 既に同じ場所に存在する場合は置けない (またはトグル対象)
  for (const r of rungs) {
    if (r.row === row) {
      if (r.col === col) return false
      if (r.col === col - 1 || r.col === col + 1) return false
    }
  }

  return true
}

/**
 * 横線をトグルする (あれば削除、制約を満たせば追加)
 */
export const toggleRung = (
  rungs: readonly Rung[],
  col: number,
  row: number,
  colCount: number,
  rowCount: number
): { rungs: Rung[]; changed: boolean } => {
  const existingIndex = rungs.findIndex((r) => r.col === col && r.row === row)
  if (existingIndex >= 0) {
    return {
      rungs: rungs.filter((_, idx) => idx !== existingIndex),
      changed: true,
    }
  }

  if (canPlaceRung(rungs, col, row, colCount, rowCount)) {
    return {
      rungs: [...rungs, { col, row }],
      changed: true,
    }
  }

  return {
    rungs: [...rungs],
    changed: false,
  }
}

/**
 * ランダムに自動で横線を引く
 * 既存の横線（手動で引いたものなど）を維持しつつ、空いている有効な場所に密度に応じて配置する。
 * rng: 0以上1未満の乱数を返す関数
 */
export const generateAutoRungs = (
  existingRungs: readonly Rung[],
  colCount: number,
  rowCount: number,
  density: number,
  rng: () => number = Math.random
): Rung[] => {
  if (colCount < 2) return []

  const result: Rung[] = [...existingRungs]

  // 全候補スロットをリストアップ
  type Slot = { col: number; row: number }
  const allSlots: Slot[] = []
  for (let r = 0; r < rowCount; r++) {
    for (let c = 0; c < colCount - 1; c++) {
      allSlots.push({ col: c, row: r })
    }
  }

  // Fisher-Yates でシャッフル
  for (let i = allSlots.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1))
    const temp = allSlots[i]
    allSlots[i] = allSlots[j]
    allSlots[j] = temp
  }

  // 目的の横線本数 (全体の可能スロット数 * density)
  const totalSlots = (colCount - 1) * rowCount
  const targetCount = Math.round(totalSlots * density)

  for (const slot of allSlots) {
    if (result.length >= targetCount) break
    if (canPlaceRung(result, slot.col, slot.row, colCount, rowCount)) {
      result.push(slot)
    }
  }

  return result
}

/**
 * 1人の参加者が上端 (col, row: 0) から下端 (endCol, row: rowCount) まで辿る全経路 (ポイントのリスト)
 */
export type TraceStep = {
  col: number
  row: number
}

export type TracePath = {
  startCol: number
  endCol: number
  steps: TraceStep[]
}

/**
 * ある縦線 (startCol) を上から下まで辿る
 * row は 0 から rowCount までの格子点を通過する。
 * 各 row において、左右に横線があるかを判定し、あれば横移動する。
 */
export const traceLadder = (
  startCol: number,
  rungs: readonly Rung[],
  rowCount: number
): TracePath => {
  // 高速参照用に row -> rungs のマップを作成
  const rungsByRow = new Map<number, number[]>()
  for (const rung of rungs) {
    const list = rungsByRow.get(rung.row) ?? []
    list.push(rung.col)
    rungsByRow.set(rung.row, list)
  }

  let currentCol = startCol
  const steps: TraceStep[] = [{ col: currentCol, row: 0 }]

  for (let r = 0; r < rowCount; r++) {
    const rowRungs = rungsByRow.get(r)
    if (rowRungs) {
      if (rowRungs.includes(currentCol)) {
        // 右に横線がある: まず横線の高さ(r + 0.5 等、または整数段)へ
        // ここでは各 row の高さを r + 0.5 または r 段目として扱う
        // steps には「分岐点」と「渡った先」を記録する
        steps.push({ col: currentCol, row: r + 0.5 })
        currentCol += 1
        steps.push({ col: currentCol, row: r + 0.5 })
      } else if (rowRungs.includes(currentCol - 1)) {
        // 左に横線がある
        steps.push({ col: currentCol, row: r + 0.5 })
        currentCol -= 1
        steps.push({ col: currentCol, row: r + 0.5 })
      }
    }
  }

  steps.push({ col: currentCol, row: rowCount })

  return {
    startCol,
    endCol: currentCol,
    steps,
  }
}

/**
 * 全参加者 (0 〜 colCount - 1) の経路をトレースする
 */
export const traceAll = (
  colCount: number,
  rungs: readonly Rung[],
  rowCount: number
): TracePath[] => {
  const result: TracePath[] = []
  for (let c = 0; c < colCount; c++) {
    result.push(traceLadder(c, rungs, rowCount))
  }
  return result
}
