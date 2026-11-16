// src/ui/ToastWidgets/toastCharacter.ts
import { TOAST_CHARACTER_RANDOM } from '@/types/ui'
import type { CharacterType } from '@/types/OmikujiData'

const hasSrc = (src?: string[]) => (src ?? []).some((p) => p && p.trim() !== '')

/** 画像を持つキャラか */
export const hasCharacterImage = (character: CharacterType): boolean =>
  Object.values(character.image ?? {}).some((item) => hasSrc(item?.src))

/**
 * トーストに表示するキャラクターの key を決める。
 * - メッセージのキャラが登録済みならそれを使う
 * - 未指定・不明なら fallback('' = なし / 'random' = 画像を持つキャラからランダム / key = そのキャラ)
 * 返す key は '' (キャラなし)か登録済みキャラの key。
 */
export const resolveToastCharacterKey = (
  characterKey: string | undefined,
  fallback: string,
  characters: CharacterType[],
  random: () => number = Math.random
): string => {
  if (characterKey && characters.some((c) => c.key === characterKey)) return characterKey
  if (!fallback) return ''

  const candidates = characters.filter(hasCharacterImage)
  if (fallback === TOAST_CHARACTER_RANDOM) {
    return candidates.length > 0 ? candidates[Math.floor(random() * candidates.length)].key : ''
  }
  return candidates.some((c) => c.key === fallback) ? fallback : ''
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
