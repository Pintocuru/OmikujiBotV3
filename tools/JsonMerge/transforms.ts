// tools/JsonMerge/transforms.ts
import { assetCategory, eventCategory } from '@/types/OmikujiData'
import type { OmikujiDataType } from '@/types/OmikujiData/'

type Ordered = { order: number }

/**
 * events(配列)と assets(Record)内のすべてのアイテムの order にオフセットを加算
 */
export function applyOrderOffset(data: OmikujiDataType, offset: number): OmikujiDataType {
  const shift = <T extends Ordered>(item: T): T => ({ ...item, order: (item.order ?? 0) + offset })

  const events = Object.fromEntries(
    eventCategory.map((category) => [category, data.events[category].map(shift)])
  ) as OmikujiDataType['events']

  const assets = Object.fromEntries(
    assetCategory.map((category) => [
      category,
      Object.fromEntries(Object.entries(data.assets[category]).map(([key, item]) => [key, shift(item)])),
    ])
  ) as OmikujiDataType['assets']

  return { ...data, events, assets }
}
