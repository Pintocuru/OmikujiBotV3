// src/ui/LiverBingo/editor/seedList.ts
import {
  LiverBingoItemSchema,
  LiverBingoSeedSchema,
  type LiverBingoItemType,
  type LiverBingoSeedType,
} from '@/types/ui'

/** 空のお題 */
export const createEmptyItem = (): LiverBingoItemType => LiverBingoItemSchema.parse({})

const cellKey = (row: number, col: number) => `${row}:${col}`

/** 使用中のマス(row:col)の集合。except は数えない固定項目の番号 */
export const usedCells = (seeds: LiverBingoSeedType[], except?: number) =>
  new Set(seeds.flatMap((seed, index) => (index === except ? [] : [cellKey(seed.row, seed.col)])))

export const isCellUsed = (seeds: LiverBingoSeedType[], row: number, col: number, except?: number) =>
  usedCells(seeds, except).has(cellKey(row, col))

/**
 * 新しい固定項目を作る(位置は、空いているマスのうち中央に近いものから選ぶ)
 * 空いているマスが無いときは null
 */
export const createSeed = (seeds: LiverBingoSeedType[], cardSize: number): LiverBingoSeedType | null => {
  const used = usedCells(seeds)
  const center = (cardSize - 1) / 2
  const free = Array.from({ length: cardSize * cardSize }, (_, i) => ({
    row: Math.floor(i / cardSize),
    col: i % cardSize,
  }))
    .filter(({ row, col }) => !used.has(cellKey(row, col)))
    .sort((a, b) => Math.hypot(a.row - center, a.col - center) - Math.hypot(b.row - center, b.col - center))
  const position = free[0]
  return position ? LiverBingoSeedSchema.parse({ ...position }) : null
}

/** カードサイズを小さくしたとき、カードの外になる固定項目を取り除く */
export const dropOutOfRange = (seeds: LiverBingoSeedType[], cardSize: number): LiverBingoSeedType[] =>
  seeds.filter((seed) => seed.row < cardSize && seed.col < cardSize)
