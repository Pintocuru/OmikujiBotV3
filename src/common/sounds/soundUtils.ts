// src/common/sounds/soundUtils.ts
import { soundMap } from '@/maps/OmikujiData'
import { SoundKeyType } from '@/types/OmikujiData'

/** プリセットサウンドのベースパス（末尾スラッシュなし） */
export const SOUND_BASE_PATH = 'assets/sounds' as const

/**
 * キーからパス（ベースパス付き）を返す
 * 例: 'cute' → 'assets/sounds/FreeSound/cute.mp3'
 */
function getSoundPath(key: SoundKeyType): string | undefined {
  const relativePath = soundMap[key]?.path
  return relativePath ? `${SOUND_BASE_PATH}/${relativePath}` : undefined
}

/**
 * sound（プリセットキー）と soundPath（カスタムパス）を解決し、
 * 実際に再生すべきパスを返す。soundPath が優先される。
 */
export function resolveSound(sound: string, soundPath: string): string | null {
  if (soundPath) return `${SOUND_BASE_PATH}/${soundPath}`
  if (sound) return getSoundPath(sound as SoundKeyType) ?? null
  return null
}
