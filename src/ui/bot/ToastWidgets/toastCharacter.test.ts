// src/ui/bot/ToastWidgets/toastCharacter.test.ts
import { describe, expect, it } from 'vitest'
import type { CharacterType } from '@/types/OmikujiData'
import { resolveToastCharacterKey, toastIconLayers } from './toastCharacter'

const make = (key: string, images: Record<string, string[]>) =>
  ({
    key,
    image: Object.fromEntries(Object.entries(images).map(([k, src]) => [k, { src }])),
  }) as unknown as CharacterType

const a = make('a', { default: ['a.png'] })
const b = make('b', { smile: ['b.png'] }) // default なし
const none = make('none', {}) // 画像なし
const all = [a, b, none]

describe('resolveToastCharacterKey', () => {
  it('登録済みのキャラが指定されていればそのまま使う', () => {
    expect(resolveToastCharacterKey('b', 'a', all)).toBe('b')
  })
  it('未指定で fallback が空なら補わない', () => {
    expect(resolveToastCharacterKey('', '', all)).toBe('')
  })
  it('未登録キーは fallback を使う', () => {
    expect(resolveToastCharacterKey('x', 'a', all)).toBe('a')
  })
  it('fallback が画像なしキャラ・未登録キーなら補わない', () => {
    expect(resolveToastCharacterKey('', 'none', all)).toBe('')
    expect(resolveToastCharacterKey('', 'x', all)).toBe('')
  })
  it('random は画像を持つキャラだけから選ぶ', () => {
    expect(resolveToastCharacterKey('', 'random', all, () => 0)).toBe('a')
    expect(resolveToastCharacterKey('', 'random', all, () => 0.99)).toBe('b')
    expect(resolveToastCharacterKey('', 'random', [none])).toBe('')
  })
})

describe('toastIconLayers', () => {
  it('iconKey → default → 最初の画像の順で探す', () => {
    expect(toastIconLayers(a, 'smile')).toEqual(['a.png'])
    expect(toastIconLayers(b, 'default')).toEqual(['b.png'])
    expect(toastIconLayers(none)).toEqual([])
    expect(toastIconLayers(null)).toEqual([])
  })
})
