// src/console/game/WordAlchemy/scripts/itemIcon.test.ts
import { describe, expect, it } from 'vitest'
import { ALCHEMY_CATEGORIES, ALCHEMY_PALETTE } from '../ai/alchemyTypes'
import { itemIconUrl } from './itemIcon'

describe('itemIconUrl', () => {
  it('同じ分類・色・名前なら、いつも同じ。名前が違えば、別の URL', () => {
    expect(itemIconUrl('A', '赤', 'ねこ')).toBe(itemIconUrl('A', '赤', 'ねこ'))
    expect(itemIconUrl('C', '青', 'ほうき')).not.toBe(itemIconUrl('C', '青', 'ぼうき'))
  })
  it('分類ごとのスタイルで、10.x の URL になる。名前は種として符号化される', () => {
    const style = (c: 'A' | 'B' | 'C' | 'D') => new URL(itemIconUrl(c, '赤', 'ラーメン')).pathname
    expect(style('A')).toBe('/10.x/initial-face/svg')
    expect(style('B')).toBe('/10.x/slice/svg')
    expect(style('C')).toBe('/10.x/icons/svg')
    expect(style('D')).toBe('/10.x/identicon/svg')
    expect(new URL(itemIconUrl('A', '赤', 'ラーメン')).searchParams.get('seed')).toBe('ラーメン')
  })
  it('色は # なしの 16 進で渡す。明るい色には暗い地、暗い色には明るい地', () => {
    const params = (c: 'A' | 'B' | 'C' | 'D', k: '赤' | '白' | '黒') => new URL(itemIconUrl(c, k, 'x')).searchParams
    expect(params('A', '赤').get('backgroundColor')).toBe('e5484d')
    expect(params('B', '赤').get('bodyColor')).toBe('e5484d')
    expect(params('B', '白').get('backgroundColor')).toBe('2a2a2a')
    expect(params('D', '黒').get('backgroundColor')).toBe('f5f5f5')
  })
  it('4 分類 × 8 色のすべてで、URL を作れる', () => {
    for (const category of ALCHEMY_CATEGORIES)
      for (const color of ALCHEMY_PALETTE)
        expect(itemIconUrl(category, color, '名前')).toMatch(/^https:\/\/api\.dicebear\.com\/10\.x\//)
  })
})
