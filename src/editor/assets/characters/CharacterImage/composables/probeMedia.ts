// src/editor/assets/characters/CharacterImage/composables/probeMedia.ts
import { isVideoPath } from '@/maps/common/ImageExtensionMap'

/** 読み込みを待つ上限。存在しない URL は普通すぐ失敗するので、これは応答が止まったときの保険 */
const DEFAULT_TIMEOUT_MS = 4000

/**
 * URL の画像・動画が実際に読み込めるかを確かめる (Image / video の読み込みイベントで判定)
 * 開発サーバが存在しないパスに index.html を返しても、画像としては読めないので false になる
 */
export function probeMedia(url: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<boolean> {
  return new Promise((resolve) => {
    let settled = false
    const element: HTMLImageElement | HTMLVideoElement = isVideoPath(url)
      ? document.createElement('video')
      : new Image()

    const finish = (ok: boolean) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      element.onerror = null
      if (element instanceof HTMLVideoElement) {
        element.onloadedmetadata = null
        element.removeAttribute('src')
        element.load() // 読み込み中の通信を止める
      } else {
        element.onload = null
        element.src = ''
      }
      resolve(ok)
    }

    const timer = setTimeout(() => finish(false), timeoutMs)
    element.onerror = () => finish(false)

    if (element instanceof HTMLVideoElement) {
      element.preload = 'metadata'
      element.muted = true
      element.onloadedmetadata = () => finish(true)
    } else {
      element.onload = () => finish(true)
    }
    element.src = url
  })
}
