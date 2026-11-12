// src/engine/ContentPlaceholder/processor.test.ts
import { describe, expect, it } from 'vitest'
import { ContentPlaceholder } from './processor'
import type { PlaceholderType } from '@/types/OmikujiData'

const placeholder = (key: string, ...values: string[]) => ({ id: key, key, values }) as unknown as PlaceholderType

const create = () =>
  new ContentPlaceholder({
    c1: placeholder('subCategory_1', '恋愛'),
    c2: placeholder('subCategory_2', '金運'),
    l11: placeholder('subLuck_11', '素敵な出会い'),
  })

describe('<<id_[[変数名]]>> (ID 内の変数)', () => {
  it('[[変数名]] を変数値に置き換えてから、プレースホルダーを解決する', () => {
    const cp = create()
    cp.updateVariables({ subRand: 2 })
    expect(cp.processText('<<subCategory_[[subRand]]>>運')).toBe('金運運')
  })

  it('空白入りの [[ 変数名 ]] や、複数の変数も使える', () => {
    const cp = create()
    cp.updateVariables({ f: 1, n: 1 })
    expect(cp.processText('<<subLuck_[[ f ]][[n]]>>')).toBe('素敵な出会い')
  })

  it('未定義の変数は、元の構文のまま残る', () => {
    const cp = create()
    cp.updateVariables({})
    expect(cp.processText('a<<subCategory_[[subRand]]>>b')).toBe('a<<subCategory_[[subRand]]>>b')
  })

  it('置き換え後のプレースホルダーが無いときも、元の構文のまま残り、後続の置換は続く', () => {
    const cp = create()
    cp.updateVariables({ subRand: 9 })
    expect(cp.processText('<<subCategory_[[subRand]]>>/<<subCategory_1>>')).toBe('<<subCategory_[[subRand]]>>/恋愛')
  })

  it('プレースホルダーの値の中にある <<id_[[変数名]]>> も解決する', () => {
    const cp = new ContentPlaceholder({
      c1: placeholder('subCategory_1', '恋愛'),
      w: placeholder('wrapper', '【<<subCategory_[[n]]>>】'),
    })
    cp.updateVariables({ n: 1 })
    expect(cp.processText('<<wrapper>>')).toBe('【恋愛】')
  })
})

describe('既存の動作 (変更なし)', () => {
  it('[[anygame_<<userId>>]] は、<<userId>> だけが置き換わる', () => {
    const cp = create()
    cp.updateResolvedValues({ userId: 'u1' })
    cp.updateVariables({ anygame_u1: 5 })
    expect(cp.processText('[[anygame_<<userId>>]]')).toBe('[[anygame_u1]]')
  })

  it('インラインランダム内の [[ ]] は、ここでは置き換えない', () => {
    const cp = create()
    cp.updateVariables({ a: 'x,y' })
    expect(cp.processText("<<'[[a]]','[[a]]'>>")).toBe('[[a]]')
  })

  it('変数を渡さなくても、通常のプレースホルダーは解決できる', () => {
    expect(create().processText('<<subCategory_1>>運')).toBe('恋愛運')
  })
})
