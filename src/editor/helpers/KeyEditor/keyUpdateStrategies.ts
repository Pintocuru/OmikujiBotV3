// src/editor/helpers/KeyEditor/keyUpdateStrategies.ts
import { AssetCategoryType } from '@/types/OmikujiData/'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { KeyUpdateStrategy } from './types'
import {
  updateMikujiReferences,
  updateCharacterReferences,
  updatePlaceholderReferences,
  updateScenarioReferences,
} from './keyUpdateReferences'

const assetKey = (
  category: AssetCategoryType,
  updateReferences: NonNullable<KeyUpdateStrategy['updateReferences']>
): KeyUpdateStrategy => ({
  updateKey: (oldKey, newKey) => useOmikujiStore().updateAssetKey(category, oldKey, newKey),
  updateReferences,
})

/**
 * Key更新戦略マップ（Key を編集できるのは assets のみ）
 */
export const updateStrategies: Record<AssetCategoryType, KeyUpdateStrategy> = {
  mikuji: assetKey('mikuji', updateMikujiReferences),
  scenarios: assetKey('scenarios', updateScenarioReferences),
  placeholders: assetKey('placeholders', updatePlaceholderReferences),
  characters: assetKey('characters', updateCharacterReferences),
}
