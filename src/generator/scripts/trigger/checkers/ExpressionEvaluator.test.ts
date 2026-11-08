// src/generator/scripts/trigger/checkers/ExpressionEvaluator.test.ts
import { describe, expect, it, vi } from 'vitest'
import { evaluateTriggerExpression, type TriggerExpressionContext } from './ExpressionEvaluator'

vi.mock('@/generator/scripts/Notice/showNotice', () => ({ showErrorNotice: vi.fn() }))

// docs/core/ConfigEditor/sub/TriggerExpression.md / TimerCondition.md に載せている例が、実際に動くことの確認
describe('判定式 (ヘルプに載せている例)', () => {
  const context: TriggerExpressionContext = {
    user: 'さくら',
    userName: 'さくら',
    userId: 'uabc123',
    lc: 200,
    tc: 12,
    price: 0,
    giftCount: 0,
    viewer: 120,
    upVote: 60,
    follower: 500,
    stage: 2,
    SyokenSagiuabc123: 2,
  }
  const ok = (expression: string, ctx: TriggerExpressionContext = context) => evaluateTriggerExpression(expression, ctx)

  it('コメントの内容・ユーザーで絞る', () => {
    expect(ok('lc % 100 == 0')).toBe(true)
    expect(ok('tc >= 10')).toBe(true)
    expect(ok("user == 'さくら'")).toBe(true)
    expect(ok('price >= 500')).toBe(false)
  })

  it('配信の状況で絞る / 条件を組み合わせる', () => {
    expect(ok('viewer >= 100')).toBe(true)
    expect(ok('upVote > 50 and follower < 1000')).toBe(true)
    expect(ok('(lc >= 10 and tc <= 3) or price > 0')).toBe(false)
    expect(ok("not (user == 'ownerName')")).toBe(true)
  })

  it('<<name>> は name と同じ。変数名に埋め込んだ <<userId>> は値に置き換わる', () => {
    expect(ok('<<lc>> > 20')).toBe(true)
    expect(ok('SyokenSagi<<userId>> < 3')).toBe(true)
    expect(ok('SyokenSagi<<userId>> < 2')).toBe(false)
  })

  it('1 人 3 回まで (未定義の変数は 0 から数える)', () => {
    expect(ok('played_<<userId>> < 3')).toBe(true)
    expect(ok('played_<<userId>> < 3', { ...context, played_uabc123: 3 })).toBe(false)
  })

  it('評価ブロックの変数 (stage) を条件にできる', () => {
    expect(ok('stage == 2')).toBe(true)
    expect(ok('stage == 3')).toBe(false)
  })

  it('演算子と関数の表に載せているもの', () => {
    expect(ok('if(lc > 100, 1, 0) == 1')).toBe(true)
    expect(ok('lc > 100 ? true : false')).toBe(true)
    expect(ok("('a' || 'b') == 'ab'")).toBe(true)
    expect(ok('2 ^ 3 == 8')).toBe(true)
    expect(ok('max(1, 5) == 5 and min(1, 5) == 1')).toBe(true)
    expect(ok('roundTo(1.234, 1) == 1.2')).toBe(true)
    expect(ok("str(lc, 'x') == '200x'")).toBe(true)
  })

  it('結果が true 以外 / 使えない記法は false', () => {
    expect(ok('lc + 1')).toBe(false)
    expect(ok('lc = 1')).toBe(false)
    expect(ok('lc > 1; tc > 1')).toBe(false)
    expect(ok('rand(1, 3) == 1')).toBe(false)
    expect(ok('SyokenSagi<<user>> < 3')).toBe(false)
  })
})

// タイマーの動作条件は、コメントがないので評価ブロックの変数だけで評価する
describe('タイマーの動作条件 (ヘルプに載せている例)', () => {
  const ok = (expression: string, ctx: TriggerExpressionContext = {}) => evaluateTriggerExpression(expression, ctx)

  it('演出中だけ / 5 回まで (未定義は 0)', () => {
    expect(ok('fireworks_on == 1', { fireworks_on: 1 })).toBe(true)
    expect(ok('fireworks_on == 1', { fireworks_on: 0 })).toBe(false)
    expect(ok('fireworks_on == 1')).toBe(false)
    expect(ok('announce_count < 5')).toBe(true)
    expect(ok('announce_count < 5', { announce_count: 5 })).toBe(false)
  })

  it('条件の組み合わせ / 文字で切り替える', () => {
    expect(ok('mode == 2 and stock > 0', { mode: 2, stock: 3 })).toBe(true)
    expect(ok('fireworks_on == 1 or party == 1', { party: 1 })).toBe(true)
    expect(ok("not (mood == 'quiet')", { mood: 'happy' })).toBe(true)
    expect(ok("mood == 'happy'", { mood: 'happy' })).toBe(true)
  })

  it('標準値 (lc など) は未定義なので 0 になる', () => {
    expect(ok('lc > 10')).toBe(false)
  })
})
