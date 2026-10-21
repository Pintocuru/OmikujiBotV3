// src/generator/scripts/trigger/checkers/ExpressionEvaluator.test.ts
import { describe, expect, it, vi } from 'vitest'
import { evaluateTriggerExpression, normalizeTriggerExpression } from './ExpressionEvaluator'

const ctx = { lc: 25, tc: 3, user: 'hoge', userName: 'hoge', price: 0, score: 5 }

describe('evaluateTriggerExpression', () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})

  it('例1: 数値の比較', () => {
    expect(evaluateTriggerExpression('<<lc>> > 20', ctx)).toBe(true)
    expect(evaluateTriggerExpression('<<lc>> > 30', ctx)).toBe(false)
    expect(evaluateTriggerExpression('<<lc>> >= 25', ctx)).toBe(true)
  })

  it('例2: 文字列の比較', () => {
    expect(evaluateTriggerExpression("<<user>> == 'hoge'", ctx)).toBe(true)
    expect(evaluateTriggerExpression("<<user>> == 'fuga'", ctx)).toBe(false)
    expect(evaluateTriggerExpression("<<user>> != 'fuga'", ctx)).toBe(true)
  })

  it('<<>> なしの変数名や空白入りの記法も使える', () => {
    expect(evaluateTriggerExpression('lc > 20', ctx)).toBe(true)
    expect(evaluateTriggerExpression('<< lc >> > 20', ctx)).toBe(true)
  })

  it('論理演算・おみくじの式で作った変数', () => {
    expect(evaluateTriggerExpression('<<lc>> > 20 and <<score>> < 10', ctx)).toBe(true)
    expect(evaluateTriggerExpression('<<lc>> > 30 or <<tc>> == 3', ctx)).toBe(true)
    expect(evaluateTriggerExpression('not (<<lc>> > 20)', ctx)).toBe(false)
  })

  it('未定義の変数は 0 として扱う', () => {
    expect(evaluateTriggerExpression('<<unknown>> == 0', ctx)).toBe(true)
    expect(evaluateTriggerExpression('<<unknown>> > 0', ctx)).toBe(false)
  })

  it('評価できない式は例外なく false', () => {
    expect(evaluateTriggerExpression(undefined, ctx)).toBe(false)
    expect(evaluateTriggerExpression('', ctx)).toBe(false)
    expect(evaluateTriggerExpression('   ', ctx)).toBe(false)
    expect(evaluateTriggerExpression('<<lc>> >', ctx)).toBe(false)
    expect(evaluateTriggerExpression('(((', ctx)).toBe(false)
    expect(evaluateTriggerExpression("<<'a','b'>>", ctx)).toBe(false)
    expect(evaluateTriggerExpression('unknownFunc(1) > 0', ctx)).toBe(false)
  })

  it('true 以外の結果 (数値・文字列) は false', () => {
    expect(evaluateTriggerExpression('<<lc>>', ctx)).toBe(false)
    expect(evaluateTriggerExpression('<<user>>', ctx)).toBe(false)
    expect(evaluateTriggerExpression('1', ctx)).toBe(false)
  })

  it('代入・関数定義・乱数・複数式は使えない (false)', () => {
    expect(evaluateTriggerExpression('score = 10', ctx)).toBe(false)
    expect(evaluateTriggerExpression('score += 1', ctx)).toBe(false)
    expect(evaluateTriggerExpression('f(x) = x + 1', ctx)).toBe(false)
    expect(evaluateTriggerExpression('random(10) >= 0', ctx)).toBe(false)
    expect(evaluateTriggerExpression('<<lc>> > 20; <<tc>> > 100', ctx)).toBe(false)
  })

  it('式は評価しても context を書き換えない', () => {
    const local = { ...ctx }
    evaluateTriggerExpression('score = 10', local)
    expect(local).toEqual(ctx)
  })

  it('視聴者が決められる値 (ユーザー名) で式を書き換えられない', () => {
    const evil = { ...ctx, user: "x' or 'a'=='a" }
    expect(evaluateTriggerExpression("<<user>> == 'hoge'", evil)).toBe(false)
    expect(evaluateTriggerExpression("<<user>> == 'x'' or ''a''==''a'", evil)).toBe(false)
  })

  it('文字列内の ; は区切りとして扱わない', () => {
    expect(evaluateTriggerExpression("<<user>> == 'a;b'", { ...ctx, user: 'a;b' })).toBe(true)
  })
})

describe('変数名に埋め込んだプレースホルダー', () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  const c = { ...ctx, userId: 'v1yzu2c1', SyokenSagiv1yzu2c1: 3, SyokenSagiv0other: 1 }

  it('SyokenSagi<<userId>> は SyokenSagiv1yzu2c1 の値で判定する', () => {
    expect(evaluateTriggerExpression('SyokenSagi<<userId>> < 3', c)).toBe(false)
    expect(evaluateTriggerExpression('SyokenSagi<<userId>> >= 3', c)).toBe(true)
    expect(evaluateTriggerExpression('SyokenSagi<<userId>> < 4', c)).toBe(true)
  })

  it('値が変わると結果も変わる', () => {
    expect(evaluateTriggerExpression('SyokenSagi<<userId>> < 3', { ...c, SyokenSagiv1yzu2c1: 2 })).toBe(true)
  })

  it('他ユーザーの変数は参照しない / 変数が未作成のユーザーは 0 扱い', () => {
    expect(evaluateTriggerExpression('SyokenSagi<<userId>> == 0', { ...c, userId: 'v0nobody' })).toBe(true)
    expect(evaluateTriggerExpression('SyokenSagi<<userId>> == 1', { ...c, userId: 'v0other' })).toBe(true)
    expect(evaluateTriggerExpression('SyokenSagi<<userId>> == 3', { ...c, userId: 'v0other' })).toBe(false)
  })

  it('埋め込めない値 (ユーザー名など) や存在しないキーは評価できない扱いで false', () => {
    expect(evaluateTriggerExpression('x<<user>> == 0', { ...c, user: "a' or 1==1 or '" })).toBe(false)
    expect(evaluateTriggerExpression('Sokuseki<<noSuchKey>> == 0', c)).toBe(false)
  })

  it('単独の <<userId>> は従来どおり変数名として扱う', () => {
    expect(evaluateTriggerExpression("<<userId>> == 'v1yzu2c1'", c)).toBe(true)
  })
})

describe('normalizeTriggerExpression', () => {
  it('<<name>> を name に置換する', () => {
    expect(normalizeTriggerExpression('<<lc>> > 20')).toBe('lc > 20')
  })
  it('変数名にならない << >> が残る場合は null', () => {
    expect(normalizeTriggerExpression("<<'a','b'>>")).toBeNull()
  })
})
