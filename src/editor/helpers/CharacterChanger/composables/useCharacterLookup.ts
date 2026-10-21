// src/editor/helpers/CharacterChanger/composables/useCharacterLookup.ts
import { storeToRefs } from 'pinia'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useCharacterManager } from '@/generator/scripts/CharacterManager/useCharacterManager'

/**
 * エディター用：編集中の omikujiStore のキャラクターを参照する CharacterManager
 */
export function useCharacterLookup() {
  const { data } = storeToRefs(useOmikujiStore())
  return useCharacterManager(() => data.value.assets.characters)
}
