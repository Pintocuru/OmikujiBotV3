// src/ui/bot/ToastWidgets/toastCharacter.test.ts
import { describe, expect, it } from 'vitest'
import type { CharacterType } from '@/types/OmikujiData'
import { getRandomToastCharacterKey, resolveToastCharacterKey, toastIconLayers } from './toastCharacter'

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
  it('登録済みのキャラが指定されていればその key を返す', () => {
    expect(resolveToastCharacterKey('b', all)).toBe('b')
  })
  it('未指定・未登録のキャラは補完しない', () => {
    expect(resolveToastCharacterKey('', all)).toBe('')
    expect(resolveToastCharacterKey('x', all)).toBe('')
    expect(resolveToastCharacterKey(undefined, all)).toBe('')
  })
})

describe('getRandomToastCharacterKey', () => {
  it('画像を持つキャラだけからランダムに選ぶ', () => {
    expect(getRandomToastCharacterKey(all, () => 0)).toBe('a')
    expect(getRandomToastCharacterKey(all, () => 0.99)).toBe('b')
    expect(getRandomToastCharacterKey([none])).toBe('')
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
