// src/engine/VariablePlaceholder/ExpressionEngine.test.ts
import { describe, expect, it } from 'vitest'
import { ExpressionEngine, normalizeExpressionText } from './ExpressionEngine'

describe('normalizeExpressionText', () => {
  it('式の外の不可視文字を取り除く', () => {
    expect(normalizeExpressionText('a = 1;\u200C')).toBe('a = 1;')
    expect(normalizeExpressionText('\uFEFFa\u200B = \u200D1\u2060')).toBe('a = 1')
  })

  it('NBSP と全角スペースを、半角スペースにする', () => {
    expect(normalizeExpressionText('a\u3000=\u00A01')).toBe('a = 1')
  })

  it('文字列の中は変更しない (絵文字のゼロ幅接合子など)', () => {
    const family = '👨\u200D👩\u200D👧'
    expect(normalizeExpressionText(`a = '${family}\u3000x'`)).toBe(`a = '${family}\u3000x'`)
    expect(normalizeExpressionText(`a = "q\\"\u200B"`)).toBe(`a = "q\\"\u200B"`)
  })
})

describe('ExpressionEngine.evaluateExpression', () => {
  it('末尾に不可視文字だけの文があっても、エラーにならない', () => {
    const engine = new ExpressionEngine()
    expect(() => engine.evaluateExpression("a = 1;b = 'x';\u200C")).not.toThrow()
    expect(engine.getAll()).toMatchObject({ a: 1, b: 'x' })
  })

  it('全角スペースが混ざっていても評価できる', () => {
    const engine = new ExpressionEngine()
    engine.evaluateExpression('a\u3000=\u30001 + 2')
    expect(engine.getAll()).toMatchObject({ a: 3 })
  })
})
