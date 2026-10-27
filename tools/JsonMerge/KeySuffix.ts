// tools/JsonMerge/KeySuffix.ts
import { OmikujiDataType, eventCategory } from '@/types/OmikujiData'

/**
 * events と mikuji の key に接尾辞を付与する(マージ時のキー衝突防止)
 * events の omikujiKey は、付与後の mikuji の key を指すよう合わせて更新する
 */
export function applyKeySuffix(data: OmikujiDataType, suffix?: string): OmikujiDataType {
  if (!suffix) return data

  const normalized = suffix[0].toUpperCase() + suffix.slice(1)

  const events = Object.fromEntries(
    eventCategory.map((category) => [
      category,
      data.events[category].map((item) => ({
        ...item,
        key: item.key + normalized,
        omikujiKey: item.omikujiKey ? item.omikujiKey + normalized : item.omikujiKey,
      })),
    ])
  ) as OmikujiDataType['events']

  const mikuji = Object.fromEntries(
    Object.entries(data.assets.mikuji).map(([key, box]) => [
      key + normalized,
      { ...box, key: box.key + normalized },
    ])
  ) as OmikujiDataType['assets']['mikuji']

  return {
    ...data,
    events,
    assets: { ...data.assets, mikuji },
  }
}
