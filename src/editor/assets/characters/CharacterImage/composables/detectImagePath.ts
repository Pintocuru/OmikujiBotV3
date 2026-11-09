// src/editor/assets/characters/CharacterImage/composables/detectImagePath.ts
import { getImagePath } from '@/common/AppEnv'
import { imageExtensions } from '@/maps/common/ImageExtensionMap'
import { probeMedia } from './probeMedia'

type DetectOptions = {
  /** キャラクターのキー (パスの先頭) */
  characterKey: string
  emotionKey: string
  /** サーバの画像一覧 (空なら未取得・取得失敗) */
  files: readonly string[]
  /** 相対パス → 読み込めるか。テストで差し替える */
  probe?: (path: string) => Promise<boolean>
}

/**
 * 1枚目の画像パス `キャラID/感情キー.拡張子` を探す。見つからなければ null
 * 1. 画像一覧にあればそれを使う (通信なし)
 * 2. なければ、全拡張子を並行して実際に読み込んで確かめ、優先順位 (imageExtensions の並び) で選ぶ
 *    一覧が空・古い (画像を追加した直後) 場合でも見つけられるよう、一覧に無いときは必ずここまで進む
 */
export async function detectImagePath({
  characterKey,
  emotionKey,
  files,
  probe = (path) => probeMedia(getImagePath(path)),
}: DetectOptions): Promise<string | null> {
  const base = `${characterKey}/${emotionKey}`

  // 一覧のファイル名は大文字小文字が混在し得るので、比較は小文字で行い、返すのは一覧の綴り
  const byLowerCase = new Map(files.map((file) => [file.toLowerCase(), file]))
  for (const extension of imageExtensions) {
    const hit = byLowerCase.get(`${base}.${extension}`.toLowerCase())
    if (hit) return hit
  }

  const results = await Promise.all(imageExtensions.map((extension) => probe(`${base}.${extension}`)))
  const index = results.findIndex(Boolean)
  return index >= 0 ? `${base}.${imageExtensions[index]}` : null
}
