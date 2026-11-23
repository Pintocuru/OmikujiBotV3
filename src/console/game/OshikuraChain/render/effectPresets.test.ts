// src/console/game/OshikuraChain/render/effectPresets.test.ts
import { describe, expect, it } from 'vitest'
import type { NuisanceEvent } from '../scripts/nuisanceEngine'
import {
  chainNoteFrequency,
  playChainBreak,
  playCoefficientReset,
  playDeath,
  playScore,
  playWordBlast,
  playWordGone,
  type BurstOptions,
  type EffectHost,
  type PopupOptions,
} from './effectPresets'

/** 演出の呼び出しを記録するだけの、偽の演出先 */
const makeHost = () => {
  const calls = {
    notes: [] as { frequency: number; delaySeconds: number }[],
    popups: [] as PopupOptions[],
    bursts: [] as BurstOptions[],
    shakes: [] as number[],
    plays: [] as string[],
  }
  const host: EffectHost = {
    play: (key) => calls.plays.push(key),
    playNote: (frequency, delaySeconds) => calls.notes.push({ frequency, delaySeconds }),
    popup: (options) => calls.popups.push(options),
    burst: (options) => calls.bursts.push(options),
    shake: (magnitude) => calls.shakes.push(magnitude),
    boardSize: { width: 704, height: 512 },
  }
  return { host, calls }
}

const score = (
  patch: Partial<Extract<NuisanceEvent, { type: 'score' }>> = {}
): Extract<NuisanceEvent, { type: 'score' }> => ({
  type: 'score',
  source: 'nuisance',
  userId: 'a',
  userName: 'A',
  seconds: 5,
  applied: 5,
  chain: 1,
  chainTotal: 5,
  coefficient: 1,
  col: 3,
  row: 2,
  delaySeconds: 0,
  ...patch,
})

describe('chainNoteFrequency', () => {
  it('1 連鎖がド、2 連鎖がレ、…、8 連鎖が 1 オクターブ上のド (ドレミファソラシド)', () => {
    const base = chainNoteFrequency(1)
    expect(base).toBeCloseTo(523.25, 1)
    const semitones = [0, 2, 4, 5, 7, 9, 11, 12]
    semitones.forEach((n, i) => expect(chainNoteFrequency(i + 1)).toBeCloseTo(base * 2 ** (n / 12), 5))
    expect(chainNoteFrequency(8)).toBeCloseTo(base * 2, 5)
  })

  it('連鎖が増えるほど、音は高くなる。2 オクターブ上のドで止まる', () => {
    for (let chain = 2; chain <= 15; chain++) {
      expect(chainNoteFrequency(chain)).toBeGreaterThan(chainNoteFrequency(chain - 1))
    }
    expect(chainNoteFrequency(15)).toBeCloseTo(chainNoteFrequency(1) * 4, 5)
    expect(chainNoteFrequency(99)).toBe(chainNoteFrequency(15))
  })

  it('0 以下や小数でも、壊れない (1 連鎖の音になる)', () => {
    expect(chainNoteFrequency(0)).toBe(chainNoteFrequency(1))
    expect(chainNoteFrequency(-3)).toBe(chainNoteFrequency(1))
    expect(chainNoteFrequency(2.9)).toBe(chainNoteFrequency(2))
  })
})

describe('playScore', () => {
  it('1 連鎖は、ドの音と「+◯秒」だけ。連鎖の文字は出ない', () => {
    const { host, calls } = makeHost()
    playScore(host, score({ seconds: 2.5 }), { x: 100, y: 200 })
    expect(calls.notes).toEqual([{ frequency: chainNoteFrequency(1), delaySeconds: 0 }])
    expect(calls.popups.map((p) => p.text)).toEqual(['+2.5秒'])
  })

  it('2 連鎖以上は、「N連鎖！」も出る。連鎖が増えるほど、大きい。ウェーブに合わせて遅れる', () => {
    const { host, calls } = makeHost()
    playScore(host, score({ chain: 3, seconds: 15, delaySeconds: 0.3 }), { x: 100, y: 200 })
    expect(calls.notes).toEqual([{ frequency: chainNoteFrequency(3), delaySeconds: 0.3 }])
    expect(calls.popups.map((p) => p.text)).toEqual(['3連鎖！', '+15秒'])
    expect(calls.popups.every((p) => p.delayMs === 300)).toBe(true)

    const small = makeHost()
    playScore(small.host, score({ chain: 2 }), { x: 0, y: 0 })
    const large = makeHost()
    playScore(large.host, score({ chain: 9 }), { x: 0, y: 0 })
    expect(large.calls.popups[0].size).toBeGreaterThan(small.calls.popups[0].size)
  })

  it('連鎖が長いときだけ、画面が揺れる', () => {
    const low = makeHost()
    playScore(low.host, score({ chain: 4 }), { x: 0, y: 0 })
    expect(low.calls.shakes).toEqual([])
    const high = makeHost()
    playScore(high.host, score({ chain: 6 }), { x: 0, y: 0 })
    expect(high.calls.shakes).toHaveLength(1)
  })
})

describe('playChainBreak / playCoefficientReset / playWordGone', () => {
  it('連鎖が切れたとき、2 連鎖以上なら TOTAL を見せる。1 連鎖なら何も出さない', () => {
    const none = makeHost()
    playChainBreak(none.host, { type: 'chainBreak', chain: 1, total: 5 })
    expect(none.calls.popups).toEqual([])
    const some = makeHost()
    playChainBreak(some.host, { type: 'chainBreak', chain: 4, total: 37.4 })
    expect(some.calls.popups.map((p) => p.text)).toEqual(['TOTAL +37秒！'])
  })

  it('初見さんで係数が戻ったときは、名前つきで知らせる', () => {
    const { host, calls } = makeHost()
    playCoefficientReset(host, { type: 'coefficientReset', userName: 'ぴんと' })
    expect(calls.popups.map((p) => p.text)).toEqual(['ぴんと さん初見！ 係数リセット！'])
    expect(calls.bursts).toHaveLength(1)
  })

  it('ことばが外へ出たときは、白い破片が飛び、アイコンと同じ explosion.mp3 (remove) が鳴る', () => {
    const { host, calls } = makeHost()
    playWordGone(host, { x: 10, y: 10, size: 64 })
    expect(calls.bursts).toHaveLength(1)
    expect(calls.bursts[0].lightness).toBeGreaterThan(90)
    expect(calls.plays).toEqual(['remove'])
  })
})

describe('playWordBlast / playDeath (exploded)', () => {
  it('ことばの爆発: 大きな爆発、強い画面揺れ、別の爆発音 (wordBlast)。explosion.mp3 は鳴らさない', () => {
    const { host, calls } = makeHost()
    playWordBlast(host, { x: 100, y: 100, size: 64 }, [])
    expect(calls.plays).toEqual(['wordBlast'])
    expect(calls.plays).not.toContain('explosion')
    expect(calls.shakes[0]).toBeGreaterThanOrEqual(8)
    expect(calls.bursts).toHaveLength(1)
  })

  it('巻き込まれたことばは、その場で白い破片になる (音は鳴らさない)', () => {
    const { host, calls } = makeHost()
    playWordBlast(host, { x: 100, y: 100, size: 64 }, [
      { x: 164, y: 100, size: 64 },
      { x: 100, y: 164, size: 64 },
    ])
    expect(calls.bursts).toHaveLength(3)
    expect(calls.plays).toEqual(['wordBlast'])
  })

  it('爆発に巻き込まれたアイコンは、破片だけ。押し出されたときの音 (remove) は鳴らさない', () => {
    const { host, calls } = makeHost()
    const event = {
      type: 'enemyDeath',
      id: 1,
      userId: 'a',
      col: 1,
      row: 1,
      footprint: 1,
      hue: 120,
      cause: 'exploded',
    } as const
    playDeath(host, event, { x: 10, y: 10, size: 64 })
    expect(calls.bursts).toHaveLength(1)
    expect(calls.plays).toEqual([])
    const removed = makeHost()
    playDeath(removed.host, { ...event, cause: 'removed' }, { x: 10, y: 10, size: 64 })
    expect(removed.calls.plays).toEqual(['remove'])
  })
})
