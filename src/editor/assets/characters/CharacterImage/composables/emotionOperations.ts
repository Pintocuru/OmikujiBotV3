// src/editor/assets/characters/CharacterImage/composables/emotionOperations.ts
import type { CharacterImageSetType } from '@/types/OmikujiData'

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
