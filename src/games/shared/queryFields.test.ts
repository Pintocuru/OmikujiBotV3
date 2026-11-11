// src/games/shared/queryFields.test.ts
import { describe, expect, it } from 'vitest'
import type { GameInputField } from '@/games/types'
import { buildQueryString, parseQueryFields } from './queryFields'

const inputs: GameInputField[] = [
  { key: 'mode', type: 'enum', options: ['', 'ツルハシ', 'TNT'], default: '' },
  { key: 'life', type: 'number', min: 1, max: 99, default: 3 },
]

describe('parseQueryFields', () => {
  it('宣言済みのキーを値に、宣言にないキーは元の文字列のまま extra に残す', () => {
    const { values, extra } = parseQueryFields('mode=ツルハシ&foo=a%20b&life=5', inputs)
    expect(values).toEqual({ mode: 'ツルハシ', life: '5' })
    expect(extra).toBe('foo=a%20b')
  })

  it('空の文字列は空の結果になる', () => {
    expect(parseQueryFields('', inputs)).toEqual({ values: {}, extra: '' })
  })
})

describe('buildQueryString', () => {
  it('空の値は出力せず、宣言順に並べる', () => {
    expect(buildQueryString({ life: '5', mode: 'TNT' }, '', inputs)).toBe('mode=TNT&life=5')
    expect(buildQueryString({ mode: '', life: '' }, '', inputs)).toBe('')
  })

  it('[[変数名]] と <<userId>> は % エンコードしない(実行前の置換が効くように)', () => {
    expect(buildQueryString({ mode: '[[m_<<userId>>]]' }, '', inputs)).toBe('mode=[[m_<<userId>>]]')
  })

  it('& = + % はエスケープし、parse で元に戻る', () => {
    const query = buildQueryString({ mode: 'a&b=c+d%' }, '', inputs)
    expect(query).toBe('mode=a%26b%3Dc%2Bd%25')
    expect(parseQueryFields(query, inputs).values.mode).toBe('a&b=c+d%')
  })

  it('extra を末尾に保つ', () => {
    expect(buildQueryString({ mode: 'TNT' }, 'foo=1', inputs)).toBe('mode=TNT&foo=1')
  })
})
