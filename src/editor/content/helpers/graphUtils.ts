// src/editor/content/helpers/graphUtils.ts
// 参照グラフ(キー → キーの集合)を扱う汎用関数。ドメインの知識は持たない。

/** from → to の隣接表 */
export type Edges = Map<string, Set<string>>

export const addEdge = (edges: Edges, from: string, to: string) => {
  const set = edges.get(from)
  if (set) set.add(to)
  else edges.set(from, new Set([to]))
}

/** start から辿って start に戻る経路(start, ..., start)。無ければ null。到達済みを記録するので 1 回 O(V+E) */
export const findCycle = (edges: Edges, start: string): string[] | null => {
  const visited = new Set<string>()
  const path: string[] = [start]
  const walk = (node: string): boolean => {
    for (const next of edges.get(node) ?? []) {
      if (next === start) {
        path.push(start)
        return true
      }
      if (visited.has(next)) continue
      visited.add(next)
      path.push(next)
      if (walk(next)) return true
      path.pop()
    }
    return false
  }
  return walk(start) ? path : null
}

/** edges 上で、自分自身に戻ってくるノード(循環に含まれるノード)の集合 */
export const cyclicNodes = (edges: Edges): Set<string> => {
  const result = new Set<string>()
  for (const node of edges.keys()) if (findCycle(edges, node)) result.add(node)
  return result
}

/** starts とそこから到達できる全ノード(starts 自身を含む)。循環があっても 1 度ずつしか辿らない */
export const reachable = (edges: Edges, starts: Iterable<string>): Set<string> => {
  const seen = new Set<string>()
  const queue = [...starts]
  while (queue.length > 0) {
    const node = queue.pop()!
    if (seen.has(node)) continue
    seen.add(node)
    for (const next of edges.get(node) ?? []) if (!seen.has(next)) queue.push(next)
  }
  return seen
}
