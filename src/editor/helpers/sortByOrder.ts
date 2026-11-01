// src/editor/helpers/sortByOrder.ts

/** order 昇順に並べた新しい配列を返す(order が無いものは 0 として扱う。元の配列は変えない) */
export const sortByOrder = <T extends { order?: number }>(list: Iterable<T>): T[] =>
  [...list].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
