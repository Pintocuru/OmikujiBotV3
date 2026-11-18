// src/editor/assets/characters/CharacterImage/composables/detectImagePath.ts
import { getImagePath } from '@/common/AppEnv'
import { imageExtensions } from '@/maps/common/ImageExtensionMap'
import { probeMedia } from './probeMedia'

type DetectOptions = {
  /** キャラクターのキー (パスの先頭) */
  characterKey: string
  emotionKey: string
  /** 相対パス → 読み込めるか。テストで差し替える */
  probe?: (path: string) => Promise<boolean>
}

/**
 * 1枚目の画像パス `キャラID/感情キー.拡張子` を探す。見つからなければ null
 * 全拡張子を並行して実際に読み込み、優先順位 (imageExtensions の並び) で選ぶ
 */
export async function detectImagePath({
  characterKey,
  emotionKey,
  probe = (path) => probeMedia(getImagePath(path)),
}: DetectOptions): Promise<string | null> {
  const base = `${characterKey}/${emotionKey}`
  const results = await Promise.all(imageExtensions.map((extension) => probe(`${base}.${extension}`)))
  const index = results.findIndex(Boolean)
  return index >= 0 ? `${base}.${imageExtensions[index]}` : null
}
