// src/editor/assets/characters/CharacterImage/composables/detectImagePath.test.ts
import { describe, expect, it, vi } from 'vitest'
import { detectImagePath } from './detectImagePath'

const base = { characterKey: 'chocolate', emotionKey: 'happy' }

describe('detectImagePath', () => {
  it('全拡張子を調べ、優先順位で見つかった画像パスを返す', async () => {
    const existing = new Set(['chocolate/happy.png', 'chocolate/happy.gif'])
    const probe = vi.fn(async (path: string) => existing.has(path))
    const found = await detectImagePath({ ...base, probe })

    expect(found).toBe('chocolate/happy.png')
    expect(probe).toHaveBeenCalledTimes(8)
    expect(probe).toHaveBeenCalledWith('chocolate/happy.webp')
    expect(probe).toHaveBeenCalledWith('chocolate/happy.png')
  })

  it('どこにも無ければ null', async () => {
    expect(await detectImagePath({ ...base, probe: async () => false })).toBeNull()
  })
})
