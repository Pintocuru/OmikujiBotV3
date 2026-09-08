// tools/JsonMerge/transforms.ts
import { AssetCategoryDataMap, recordCategoryLabel, RecordCategoryType } from '@/types/OmikujiData'
import type { OmikujiDataType } from '@/types/OmikujiData/'
import type { AccessLevelType } from '@shared/types'

/**
 * OmikujiData内のすべてのRecord型プロパティに対してaccessLevelを強制上書き
 */
export function applyAccessLevel(data: OmikujiDataType, level: AccessLevelType): OmikujiDataType {
  const result = { ...data }

  // TODO: assetCategory eventCategory をつかうこと
  for (const category of recordCategoryLabel) {
    applyAccessLevelToCategory(result, data, category, level)
  }

  return result
}
function applyAccessLevelToCategory<K extends RecordCategoryType>(
  target: OmikujiDataType,
  source: OmikujiDataType,
  category: K,
  level: AccessLevelType
) {
  const obj = source[category] as AssetCategoryDataMap[K]

  // 存在しないならスキップ
  if (!obj) {
    ;(target as any)[category] = {} as AssetCategoryDataMap[K]
    return
  }

  const updated: AssetCategoryDataMap[K] = Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, { ...v, accessLevel: level }])
  ) as AssetCategoryDataMap[K]

  ;(target as any)[category] = updated
}

/**
 * OmikujiData内のすべてのRecord型プロパティのorderプロパティに対してオフセットを加算
 * comments, timers, actionSets, placeholders, charactersが対象
 */
export function applyOrderOffset(data: OmikujiDataType, offset: number): OmikujiDataType {
  const result = { ...data }

  // TODO: assetCategory eventCategory をつかうこと
  for (const category of recordCategoryLabel) {
    applyOrderOffsetToCategory(result, data, category, offset)
  }

  return result
}

function applyOrderOffsetToCategory<K extends RecordCategoryType>(
  target: OmikujiDataType,
  source: OmikujiDataType,
  category: K,
  offset: number
) {
  const obj = source[category] as AssetCategoryDataMap[K]

  const shifted = {} as AssetCategoryDataMap[K]

  for (const key in obj) {
    const value = obj[key]
    shifted[key] = {
      ...value,
      order: (value.order ?? 0) + offset,
    }
  }

  ;(target as any)[category] = shifted
}
