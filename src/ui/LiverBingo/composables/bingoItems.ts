// src/ui/LiverBingo/composables/bingoItems.ts
import type { LiverBingoItemType, LiverBingoSeedType } from '@/types/ui'

/** お題が 1 件も無いときのマス */
export const EMPTY_ITEM: LiverBingoItemType = { title: '未設定', weight: 0, target: 1, unit: 1 }

type Random = () => number

/** 重み付きで 1 件選ぶ(重みがすべて 0 なら均等) */
const pickWeighted = (pool: LiverBingoItemType[], random: Random): LiverBingoItemType => {
  if (pool.length === 0) return EMPTY_ITEM
  const total = pool.reduce((sum, item) => sum + item.weight, 0)
  if (total <= 0) return pool[Math.floor(random() * pool.length)]
  let value = random() * total
  for (const item of pool) {
    value -= item.weight
    if (value <= 0) return item
  }
  return pool[pool.length - 1]
}

/** title が空のお題は使わない */
const validItems = (items: LiverBingoItemType[]) => items.filter((item) => item.title !== '')

const shuffle = <T>(list: T[], random: Random): T[] => {
  const result = [...list]
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1))
    ;[result[i], result[j]] = [result[j], result[i]]
  }
  return result
}

/**
 * カードを生成する
 * 1. ランダム項目から、重み付きで totalCells 個選ぶ(未使用のお題を優先し、使い切ったら重複を許す)
 * 2. シャッフルする
 * 3. 固定項目(title が空でないもの)で、同じ位置のマスを上書きする
 *    カードの外の位置は無視する。同じ位置が重なったときは、後ろの項目を使う
 */
export const generateCard = (
  cardSize: number,
  randomSeeds: LiverBingoItemType[],
  fixedSeeds: LiverBingoSeedType[],
  random: Random = Math.random
): LiverBingoItemType[] => {
  const totalCells = cardSize * cardSize
  const pool = validItems(randomSeeds)
  const used = new Set<string>()
  const picked: LiverBingoItemType[] = []

  while (picked.length < totalCells) {
    const unused = pool.filter((item) => !used.has(item.title))
    const item = pickWeighted(unused.length > 0 ? unused : pool, random)
    picked.push(item)
    used.add(item.title)
  }

  const card = shuffle(picked, random)
  for (const seed of fixedSeeds) {
    if (seed.title === '' || seed.row >= cardSize || seed.col >= cardSize) continue
    card[seed.row * cardSize + seed.col] = seed
  }
  return card
}

/** 今のお題以外から選び直す(他に候補が無ければ同じお題になることがある) */
export const rerollItem = (
  randomSeeds: LiverBingoItemType[],
  current: LiverBingoItemType,
  random: Random = Math.random
): LiverBingoItemType => {
  const pool = validItems(randomSeeds)
  const others = pool.filter((item) => item.title !== current.title)
  return pickWeighted(others.length > 0 ? others : pool, random)
}
