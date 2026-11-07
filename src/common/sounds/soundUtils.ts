// src/common/sounds/soundUtils.ts
import { soundMap } from '@/maps/OmikujiData'
import { SoundKeyType } from '@/types/OmikujiData'
import { getSoundPath as toSoundPath } from '@/common/AppEnv'

/**
 * キーからパス（ベースパス付き）を返す
 * 例: 'cute' → 'sounds/FreeSound/cute.mp3'
 */
function getSoundPath(key: SoundKeyType): string | undefined {
  const relativePath = soundMap[key]
  return relativePath ? toSoundPath(relativePath) : undefined
}

/**
 * sound（プリセットキー）と soundPath（カスタムパス）を解決し、
 * 実際に再生すべきパスを返す。soundPath が優先される。
 */
export function resolveSound(sound: string, soundPath: string): string | null {
  if (soundPath) return toSoundPath(soundPath)
  if (sound) return getSoundPath(sound as SoundKeyType) ?? null
  return null
}
