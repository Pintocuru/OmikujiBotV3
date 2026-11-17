// src/ui/bot/ToastWidgets/toastCharacter.ts
import type { CharacterType } from '@/types/OmikujiData'

const hasSrc = (src?: string[]) => (src ?? []).some((p) => p && p.trim() !== '')

/** 画像を持つキャラか */
export const hasCharacterImage = (character: CharacterType): boolean =>
  Object.values(character.image ?? {}).some((item) => hasSrc(item?.src))

/** メッセージに指定されたキャラクターが登録済みか確認する */
export const resolveToastCharacterKey = (characterKey: string | undefined, characters: CharacterType[]): string =>
  characterKey && characters.some((character) => character.key === characterKey) ? characterKey : ''

/** プレビュー用: 画像を持つ登録キャラクターからランダムに1人選ぶ */
export const getRandomToastCharacterKey = (
  characters: CharacterType[],
  random: () => number = Math.random
): string => {
  const candidates = characters.filter(hasCharacterImage)
  return candidates.length > 0 ? candidates[Math.floor(random() * candidates.length)].key : ''
}

/**
 * アイコン画像(レイヤー)を取得。iconKey の画像 → default → 最初に画像のある表情の順で探す
 */
export const toastIconLayers = (character: CharacterType | null | undefined, iconKey = 'default'): string[] => {
  const image = character?.image
  if (!image) return []
  const clean = (src?: string[]) => (src ?? []).filter((p) => p && p.trim() !== '')

  const target = clean(image[iconKey]?.src)
  if (target.length > 0) return target
  const def = clean(image['default']?.src)
  if (def.length > 0) return def
  for (const item of Object.values(image)) {
    const src = clean(item?.src)
    if (src.length > 0) return src
  }
  return []
}
