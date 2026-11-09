import { describe, expect, it } from 'vitest'
import { getPathExtension, imageExtensions, isImageExtension, isVideoPath } from './ImageExtensionMap'

describe('ImageExtensionMap', () => {
  it('自動検出の優先順位は webp が先頭', () => {
    expect(imageExtensions[0]).toBe('webp')
  })

  it('拡張子を小文字で取り出す (クエリ付きでも)', () => {
    expect(getPathExtension('chocolate/default.WEBP')).toBe('webp')
    expect(getPathExtension('a/b.mp4?v=2')).toBe('mp4')
    expect(getPathExtension('chocolate/default')).toBe('')
    expect(getPathExtension('v1.2/default')).toBe('')
  })

  it('画像・動画の拡張子を判定する', () => {
    expect(isImageExtension('png')).toBe(true)
    expect(isImageExtension('txt')).toBe(false)
    expect(isVideoPath('a/b.webm')).toBe(true)
    expect(isVideoPath('a/b.webp')).toBe(false)
  })
})
