// src/editor/assets/characters/CharacterImage/composables/emotionOperations.ts
import type { CharacterImageSetType, CharacterImageType } from '@/types/OmikujiData'

// 数字だけのキーは JS の仕様でオブジェクトの先頭に昇順で並び、ドラッグした並び順を保存できないため使わせない
export const NUMERIC_KEY_PATTERN = /^\d+$/

// キーは画像パス(`キャラID/キー.拡張子`)の組み立てに使うため、パスの区切りは使わせない
const PATH_SEPARATOR_PATTERN = /[\\/]/

export type EmotionKeyError = 'empty' | 'numeric' | 'invalidChar' | 'duplicate'

/**
 * 編集ダイアログで入力されたキーの検証。問題なければ null。
 * 元のキーのままなら常に有効(過去のデータに残っているキーを、変更しないまま保存できなくしない)
 */
export const validateEmotionKey = (
  images: CharacterImageSetType,
  originalKey: string,
  input: string
): EmotionKeyError | null => {
  const key = input.trim()
  if (key === originalKey) return null
  if (!key) return 'empty'
  if (NUMERIC_KEY_PATTERN.test(key)) return 'numeric'
  if (PATH_SEPARATOR_PATTERN.test(key)) return 'invalidChar'
  if (key in images) return 'duplicate'
  return null
}

/**
 * 感情のキーを付け替えて(値も差し替えて)、元と同じ位置に置いた新しい images を返す(オブジェクトの順序を組み直す)。
 * 元のキーがない、または別の感情が newKey を使っているときは null
 * 注意: 他のデータ(シナリオの iconKey など)の参照は書き換えない
 */
export const renameEmotion = (
  images: CharacterImageSetType,
  oldKey: string,
  newKey: string,
  value: CharacterImageType
): CharacterImageSetType | null => {
  if (!(oldKey in images)) return null
  if (newKey !== oldKey && newKey in images) return null
  const entries = Object.entries(images).map(([key, current]): [string, CharacterImageType] =>
    key === oldKey ? [newKey, value] : [key, current]
  )
  return Object.fromEntries(entries) as CharacterImageSetType
}

/** `${key}_2`, `${key}_3` … と、空いている最初のキーを返す(元が数字キーでも接尾辞で数字だけのキーにならない) */
export const nextCopyKey = (images: CharacterImageSetType, key: string): string => {
  let n = 2
  while (`${key}_${n}` in images) n++
  return `${key}_${n}`
}

/**
 * 感情を複製し、元の直後に挿入した新しい images を返す(オブジェクトの順序を組み直す)。
 * animation は深くコピーし、src は元と同じファイルを指したまま。元のキーがなければ null
 */
export const duplicateEmotion = (
  images: CharacterImageSetType,
  key: string,
  makeLabel: (originalLabel: string) => string
): { images: CharacterImageSetType; newKey: string } | null => {
  const source = images[key]
  if (!source) return null

  const newKey = nextCopyKey(images, key)
  // reactive な値でも安全に複製できるよう JSON 経由でコピーする
  const copy = JSON.parse(JSON.stringify(source)) as CharacterImageSetType[string]
  copy.label = makeLabel(source.label || key)

  const entries: [string, CharacterImageSetType[string]][] = []
  for (const entry of Object.entries(images)) {
    entries.push(entry)
    if (entry[0] === key) entries.push([newKey, copy])
  }
  return { images: Object.fromEntries(entries) as CharacterImageSetType, newKey }
}
