// src/console/game/WordAlchemy/ai/alchemy.test.ts
import { describe, expect, it } from 'vitest'
import { POT_KEYS } from '../maps/WordAlchemyPotMap'
import { acceptsWord } from '../scripts/potRules'
import { splitWords } from '../scripts/words'
import { AlchemyRateLimitError, runAlchemy } from './alchemy'
import { buildPrompt } from './buildPrompt'
import { mockAlchemy } from './mockAlchemy'
import { isWithinMaterials, validateResult } from './validateResult'

const M = ['カレーは辛', 'の空気清浄', 'せすぴん']
const json = (n: string, c = 'A', k = '赤') => JSON.stringify({ c, k, n })
/** 決まった列を繰り返す乱数 */
const seq = (...values: number[]) => {
  let i = 0
  return () => values[i++ % values.length]
}

describe('acceptsWord', () => {
  it('水炊き・圧力は、数字だけ・記号だけを投げる', () => {
    for (const pot of ['mizutaki', 'pressure'] as const) {
      expect(acceptsWord(pot, '12345')).toBe(false)
      expect(acceptsWord(pot, '!?!?!')).toBe(false)
      expect(acceptsWord(pot, '😀😀')).toBe(false)
      expect(acceptsWord(pot, 'wwwww')).toBe(true)
      expect(acceptsWord(pot, 'abc12')).toBe(true)
    }
  })
  it('闇鍋は何でも、カナ鍋は記号だけを投げる', () => {
    expect(acceptsWord('yami', '!?!?!')).toBe(true)
    expect(acceptsWord('kana', '12345')).toBe(true)
    expect(acceptsWord('kana', '!?!?!')).toBe(false)
  })
})

describe('isWithinMaterials', () => {
  it('省略できない鍋は、すべて使う (並べ替え・結合は可)', () => {
    expect(isWithinMaterials('ぴんせすん', ['せすぴん'], 'mizutaki')).toBe(false) // ん が 1 つ多い
    expect(isWithinMaterials('ぴんせす', ['せすぴん'], 'mizutaki')).toBe(true)
    expect(isWithinMaterials('せす', ['せすぴん'], 'mizutaki')).toBe(false)
  })
  it('省略できる鍋は、一部だけ使える。ただし材料にない文字・多すぎる回数は不可', () => {
    expect(isWithinMaterials('せす', ['せすぴん'], 'pressure')).toBe(true)
    expect(isWithinMaterials('せせ', ['せすぴん'], 'pressure')).toBe(false)
    expect(isWithinMaterials('せか', ['せすぴん'], 'pressure')).toBe(false)
  })
  it('かな変換・清濁変換は、許可した鍋だけ', () => {
    expect(isWithinMaterials('セスピン', ['せすぴん'], 'kana')).toBe(true)
    expect(isWithinMaterials('セズピン', ['せすぴん'], 'kana')).toBe(false) // 濁点の追加は、かな変換では不可
    expect(isWithinMaterials('セスピン', ['せすぴん'], 'yami')).toBe(false)
    expect(isWithinMaterials('せずびん', ['せすぴん'], 'yami')).toBe(true)
    expect(isWithinMaterials('せずびん', ['せすぴん'], 'mizutaki')).toBe(false)
  })
  it('「・」は材料になくても使える', () => {
    expect(isWithinMaterials('せす・ぴん', ['せすぴん'], 'mizutaki')).toBe(true)
  })
  it('NFC に正規化して比べる', () => {
    expect(isWithinMaterials('が', ['\u304b\u3099'], 'mizutaki')).toBe(true)
  })
})

describe('validateResult', () => {
  it('コードフェンス・前後の文があっても読める', () => {
    const fenced = '```json\n' + json('ぴんせすん'.slice(0, 4)) + '\n```'
    expect(validateResult(fenced, ['せすぴん'], 'mizutaki').ok).toBe(true)
    expect(validateResult('どうぞ: ' + json('ぴんせす') + ' 以上', ['せすぴん'], 'mizutaki').ok).toBe(true)
  })
  it('JSON でない・分類が不正・名前がない/空/長すぎる・範囲外は失敗', () => {
    expect(validateResult('できました', M, 'pressure').ok).toBe(false)
    expect(validateResult(json('せす', 'E'), M, 'pressure').ok).toBe(false)
    expect(validateResult('{"c":"A","k":"赤"}', M, 'pressure').ok).toBe(false)
    expect(validateResult(json(''), M, 'pressure').ok).toBe(false)
    expect(validateResult(json('せ'.repeat(13)), ['せ'.repeat(15)], 'pressure').ok).toBe(false)
    expect(validateResult(json('ねこ'), M, 'pressure').ok).toBe(false)
  })
  it('全部使う鍋は、12 文字を超えても、材料の文字をすべて使っていれば通る', () => {
    const materials = ['あいうえお', 'かきくけこ', 'さしすせそ']
    expect(validateResult(json('あいうえおかきくけこさしすせそ'), materials, 'mizutaki').ok).toBe(true)
  })
  it('パレット外の色は、ランダムで置き換える', () => {
    const checked = validateResult(json('せす', 'B', '虹'), ['せすぴん'], 'pressure', seq(0))
    expect(checked).toEqual({ ok: true, result: { c: 'B', k: '赤', n: 'せす' } })
  })
})

describe('buildPrompt', () => {
  it('材料は JSON 配列で、コメントの引用符やカンマで壊れない', () => {
    const prompt = buildPrompt(['a,"b"', 'c', 'd'], 'pressure')
    expect(prompt).toContain('材料: ["a,\\"b\\"","c","d"]')
    expect(prompt).toContain('圧力鍋')
    expect(prompt).toContain('12 文字以内')
    expect(buildPrompt(['a', 'b', 'c'], 'mizutaki')).not.toContain('12 文字以内')
  })
})

describe('mockAlchemy', () => {
  it('どの鍋でも、どんな材料でも、結果は検証を通る', () => {
    const materialSets = [M, ['wwwww', 'wwwww', 'wwwww'], ['ガギグゲゴ', 'ぱぴぷぺぽ', 'あ'], ['😀😀', '12345', '!?・!?']]
    for (const pot of POT_KEYS) {
      for (const materials of materialSets) {
        for (let i = 0; i < 50; i++) {
          const result = mockAlchemy(materials, pot)
          expect(validateResult(JSON.stringify(result), materials, pot).ok, `${pot} ${materials} ${result.n}`).toBe(true)
        }
      }
    }
  })
})

describe('runAlchemy', () => {
  it('client がなければ Mock', async () => {
    const outcome = await runAlchemy(M, 'pressure', null)
    expect(outcome).toMatchObject({ source: 'mock', rateLimited: false })
  })
  it('検証に通れば AI の結果。失敗したら 2 回までやり直す', async () => {
    let calls = 0
    const client = { complete: async () => (++calls < 3 ? '壊れた' : json('せす')) }
    const outcome = await runAlchemy(['せすぴん'], 'pressure', client)
    expect(outcome.source).toBe('ai')
    expect(calls).toBe(3)
  })
  it('3 回とも失敗したら Mock', async () => {
    let calls = 0
    const client = { complete: async () => (++calls, 'だめ') }
    expect((await runAlchemy(M, 'pressure', client)).source).toBe('mock')
    expect(calls).toBe(3)
  })
  it('429 は、やり直さず Mock にして、上限超過を知らせる。通信の失敗も Mock', async () => {
    let calls = 0
    const limited = { complete: async () => { calls++; throw new AlchemyRateLimitError() } }
    expect(await runAlchemy(M, 'pressure', limited)).toMatchObject({ source: 'mock', rateLimited: true })
    expect(calls).toBe(1)
    const broken = { complete: async () => { throw new Error('network') } }
    expect(await runAlchemy(M, 'pressure', broken)).toMatchObject({ source: 'mock', rateLimited: false })
  })
})

describe('splitWords', () => {
  it('5 文字ずつ・最大 5 個・空白だけなら空', () => {
    expect(splitWords('あいうえおかきく')).toEqual(['あいうえお', 'かきく'])
    expect(splitWords('あ'.repeat(40))).toHaveLength(5)
    expect(splitWords('  \n ')).toEqual([])
  })
})
