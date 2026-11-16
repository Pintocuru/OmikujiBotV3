// src/ui/LiverBingo/editor/packs/packImport.ts
import {
  LiverBingoItemSchema,
  LiverBingoSeedSchema,
  type LiverBingoItemType,
  type LiverBingoSeedType,
} from '@/types/ui'
import { createSeed } from '../seedList'

/** ランダム項目にパックのお題を追加する(同じお題が既にあれば追加しない) */
export const addPackItems = (current: LiverBingoItemType[], packItems: LiverBingoItemType[]) => {
  const titles = new Set(current.map((item) => item.title))
  const added: LiverBingoItemType[] = []
  for (const item of packItems) {
    if (titles.has(item.title)) continue
    titles.add(item.title)
    added.push(LiverBingoItemSchema.parse(item))
  }
  return { items: [...current, ...added], added: added.length, skipped: packItems.length - added.length }
}

/** ランダム項目をパックのお題に置き換える */
export const replacePackItems = (packItems: LiverBingoItemType[]) =>
  packItems.map((item) => LiverBingoItemSchema.parse(item))

/**
 * 固定項目をパックのお題に置き換える
 * 中央に近い空きマスから順に入れる。マスが足りなければ、入らなかった分は捨てる
 */
export const replaceFixedSeeds = (packFixed: LiverBingoItemType[], cardSize: number) => {
  const seeds: LiverBingoSeedType[] = []
  for (const item of packFixed) {
    const position = createSeed(seeds, cardSize)
    if (!position) break
    seeds.push(LiverBingoSeedSchema.parse({ ...item, row: position.row, col: position.col }))
  }
  return { seeds, placed: seeds.length, skipped: packFixed.length - seeds.length }
}
