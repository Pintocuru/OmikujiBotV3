// src/editor/helpers/CharacterChanger/composables/useCharacterLookup.ts
import { storeToRefs } from 'pinia'
import { useOmikujiStore } from '@/editor/stores/useOmikujiStore'
import { useCharacters } from '@/generator/composables/useCharacters'

/**
 * エディター用：編集中の omikujiStore のキャラクターを参照する CharacterResolver
 */
export function useCharacterLookup() {
  const { data } = storeToRefs(useOmikujiStore())
  return useCharacters(() => data.value.assets.characters)
}
