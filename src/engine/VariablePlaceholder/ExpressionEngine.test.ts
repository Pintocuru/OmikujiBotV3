// src/engine/VariablePlaceholder/ExpressionEngine.test.ts
import { describe, expect, it } from 'vitest'
import { ExpressionEngine } from './ExpressionEngine'

describe('ExpressionEngine の複合代入', () => {
  const run = (code: string) => {
    const engine = new ExpressionEngine()
    engine.evaluateExpression(code)
    return engine.getAll()
  }

  it('+= -= *= /= が使える', () => {
    expect(run('a = 10; a += 5')).toEqual({ a: 15 })
    expect(run('a = 10; a -= 3')).toEqual({ a: 7 })
    expect(run('a = 10; a *= 2')).toEqual({ a: 20 })
    expect(run('a = 10; a /= 4')).toEqual({ a: 2.5 })
  })

  it('右辺は括弧で囲んで計算される (a -= 1 + 1 は a - 2)', () => {
    expect(run('a = 10; a -= 1 + 1')).toEqual({ a: 8 })
    expect(run('a = 2; a *= 3 + 1')).toEqual({ a: 8 })
  })

  it('未定義の変数は 0 から始まる', () => {
    expect(run('count += 1')).toEqual({ count: 1 })
  })

  it('他の変数・関数・三項演算子と組み合わせられる', () => {
    expect(run('a = 1; b = 4; a += b * 2')).toEqual({ a: 9, b: 4 })
    expect(run('s = 5; s += s >= 5 ? 10 : 0')).toEqual({ s: 15 })
    expect(run('d = 0; d += rand(3, 3)')).toEqual({ d: 3 })
  })

  it('比較の == や、通常の代入には影響しない', () => {
    expect(run("a = 1; r = a == 1 ? 'yes' : 'no'")).toEqual({ a: 1, r: 'yes' })
    expect(run('a = 3; a = a - 1')).toEqual({ a: 2 })
  })

  it('代入だけの式なので、出力はない', () => {
    const engine = new ExpressionEngine()

    expect(engine.evaluateExpression('a += 1')).toEqual({ output: '', hasOutput: false })
  })
})
