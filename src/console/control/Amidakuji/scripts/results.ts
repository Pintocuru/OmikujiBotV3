// src/console/control/Amidakuji/scripts/results.ts
// 発表の結果一覧 (参加者 → ゴール) を組み立てる
import type { GoalItem } from './goals'
import type { TracePath } from './ladder'

export type ResultEntry<P> = {
  player: P
  goal: GoalItem
  startCol: number
  endCol: number
}

/** 発表済みの参加者の結果を、当たりを先頭にして返す。ゴールや参加者が見つからない行は除く */
export const buildResults = <P>(
  players: readonly P[],
  goals: readonly GoalItem[],
  paths: readonly TracePath[],
  revealed: ReadonlySet<number>
): ResultEntry<P>[] => {
  const list: ResultEntry<P>[] = []
  paths.forEach((path, idx) => {
    if (!revealed.has(idx)) return
    const player = players[idx]
    const goal = goals[path.endCol]
    if (!player || !goal) return
    list.push({ player, goal, startCol: path.startCol, endCol: path.endCol })
  })
  return list.sort((a, b) => Number(b.goal.isHit) - Number(a.goal.isHit))
}
