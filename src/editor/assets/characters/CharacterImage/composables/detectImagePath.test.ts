// src/editor/assets/characters/CharacterImage/composables/detectImagePath.test.ts
import { describe, expect, it, vi } from 'vitest'
import { detectImagePath } from './detectImagePath'

const base = { characterKey: 'chocolate', emotionKey: 'happy' }

describe('detectImagePath', () => {
  it('一覧にあれば通信せずにそれを返す (優先順位は webp が先)', async () => {
    const probe = vi.fn()
    const found = await detectImagePath({
      ...base,
      files: ['chocolate/happy.png', 'chocolate/happy.webp'],
      probe,
    })
    expect(found).toBe('chocolate/happy.webp')
    expect(probe).not.toHaveBeenCalled()
  })

  it('一覧の綴り (大文字小文字) をそのまま返す', async () => {
    const found = await detectImagePath({ ...base, files: ['chocolate/Happy.PNG'], probe: vi.fn() })
    expect(found).toBe('chocolate/Happy.PNG')
  })

  it('一覧が空なら全拡張子を読み込んで確かめ、優先順位で選ぶ', async () => {
    const existing = new Set(['chocolate/happy.png', 'chocolate/happy.gif'])
    const probe = vi.fn(async (path: string) => existing.has(path))
    const found = await detectImagePath({ ...base, files: [], probe })
    expect(found).toBe('chocolate/happy.png')
    expect(probe).toHaveBeenCalledTimes(8)
  })

  it('一覧に無くても、読み込めれば見つかる (一覧が古い場合)', async () => {
    const found = await detectImagePath({
      ...base,
      files: ['chocolate/other.webp'],
      probe: async (path) => path === 'chocolate/happy.mp4',
    })
    expect(found).toBe('chocolate/happy.mp4')
  })

  it('どこにも無ければ null', async () => {
    expect(await detectImagePath({ ...base, files: [], probe: async () => false })).toBeNull()
  })
})
