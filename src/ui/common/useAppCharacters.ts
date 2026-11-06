// src/ui/common/useAppCharacters.ts
import { useAppStore } from '@/generator/stores/useAppStore'
import { useCharacters } from '@/common/Characters/useCharacters'

/**
 * ジェネレーターのデータ(appStore)のキャラクターを使う useCharacters
 */
export const useAppCharacters = () => {
  const appStore = useAppStore()
  return useCharacters(() => appStore.data.assets.characters)
}
