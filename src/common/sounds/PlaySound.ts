// src/common/sounds/PlaySound.ts
import { resolveSound } from './soundUtils'

/**
 * pathを解決して再生
 */
const resolveAsset = (path: string) => {
  const base = window.OmikujiBot?.assetBase ?? './'
  return base + path
}

/**
 * sound + soundPath を解決して再生
 */
export const playSoundResolved = (sound: string, soundPath = '') => {
  const path = resolveSound(sound, soundPath)
  if (!path) return
  const audio = new Audio(resolveAsset(path))
  audio.currentTime = 0
  audio.play().catch((e) => console.warn(`Sound failed to play:`, e))
}

/**
 * 指定秒数後に再生
 */
export const playSoundDelay = (sound: string, soundPath = '', delaySeconds = 0) => {
  if (!sound && !soundPath) return
  setTimeout(() => playSoundResolved(sound, soundPath), delaySeconds * 1000)
}
