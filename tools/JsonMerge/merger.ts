// tools/JsonMerge/merger.ts
import { OmikujiDataType, eventCategory, assetCategory } from '@/types/OmikujiData'

/**
 * events: 配列なのでカテゴリごとに連結
 */
function mergeEvents(
  target: OmikujiDataType['events'] | undefined,
  source: OmikujiDataType['events']
): OmikujiDataType['events'] {
  return Object.fromEntries(
    eventCategory.map((category) => [category, [...(target?.[category] ?? []), ...source[category]]])
  ) as OmikujiDataType['events']
}

/**
 * assets: Record なのでカテゴリごとにキーで統合(同一キーは後勝ち)
 * characters は上書き(最後のデータで統一)
 */
function mergeAssets(
  target: OmikujiDataType['assets'] | undefined,
  source: OmikujiDataType['assets']
): OmikujiDataType['assets'] {
  const merged = Object.fromEntries(
    assetCategory.map((category) => [category, { ...target?.[category], ...source[category] }])
  ) as OmikujiDataType['assets']

  return { ...merged, characters: source.characters }
}

/**
 * JsonMerge:複数のOmikujiDataを統合
 * events / assets 以外(ui, settings, meta, jsonMerge など)は最後のデータで上書き
 */
export function mergeOmikujiData(...dataArray: OmikujiDataType[]): OmikujiDataType {
  let result: OmikujiDataType | undefined

  for (const data of dataArray) {
    const { events, assets, ...rest } = data
    result = {
      ...result,
      ...rest,
      events: mergeEvents(result?.events, events),
      assets: mergeAssets(result?.assets, assets),
    }
  }

  return result ?? ({} as OmikujiDataType)
}
