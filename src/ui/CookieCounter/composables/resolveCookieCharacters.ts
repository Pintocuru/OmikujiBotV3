// src/ui/CookieCounter/composables/resolveCookieCharacters.ts
import type { useCharacters } from '@/common/characters/useCharacters'
import type { CookieCounterType, ShownCharacter } from '@/types/ui'

type CharacterResolver = Pick<
  ReturnType<typeof useCharacters>,
  'hasImage' | 'resolveEmotion' | 'iconSrc' | 'getCharacter'
>

/**
 * 設定のキャラクターを、表示用(画像レイヤーとアニメーション)に解決する
 * - 順番は設定のまま保つ(何番目を何に使うかは component が決めるため)。画像がなければ null
 * - 解決は component の外で行う(ジェネレーターは appStore、エディターのプレビューは omikujiStore のキャラクターを使うため)
 */
export const resolveCookieCharacters = (
  characters: CookieCounterType['characters'],
  resolver: CharacterResolver
): (ShownCharacter | null)[] =>
  characters.map(({ characterKey, iconKey }) => {
    if (!resolver.hasImage(characterKey)) return null
    const emotion = resolver.resolveEmotion(characterKey, iconKey)
    return {
      key: characterKey,
      layers: resolver.iconSrc(characterKey, emotion),
      animation: resolver.getCharacter(characterKey)?.image[emotion]?.animation,
    }
  })
