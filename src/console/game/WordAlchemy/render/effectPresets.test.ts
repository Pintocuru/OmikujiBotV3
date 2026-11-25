// src/console/game/WordAlchemy/render/effectPresets.test.ts
import { describe, expect, it } from 'vitest'
import {
  playBrewDone,
  playBrewStart,
  playIntake,
  playReject,
  playSpawn,
  playWordGone,
  type BurstOptions,
  type EffectHost,
  type PopupOptions,
} from './effectPresets'
import type { SoundKey } from './stageSounds'

const recorder = () => {
  const sounds: SoundKey[] = []
  const bursts: BurstOptions[] = []
  const popups: PopupOptions[] = []
  const shakes: number[] = []
  const host: EffectHost = {
    play: (key) => sounds.push(key),
    burst: (o) => bursts.push(o),
    popup: (o) => popups.push(o),
    shake: (magnitude) => shakes.push(magnitude),
  }
  return { host, sounds, bursts, popups, shakes }
}
const pot = { top: { x: 100, y: 40 }, center: { x: 100, y: 120 } }

describe('effectPresets', () => {
  it('結果の種類ごとに、鳴る音が違う。新種だけが派手 (粒が多く、画面が揺れる)', () => {
    const results = (['new', 'known', 'lost'] as const).map((kind) => {
      const r = recorder()
      playBrewDone(r.host, kind, pot.center)
      return r
    })
    expect(results.map((r) => r.sounds)).toEqual([['discoverNew'], ['discoverKnown'], ['lost']])
    expect(results[0].bursts[0].count).toBeGreaterThan(results[1].bursts[0].count)
    expect(results[0].shakes.length).toBe(1)
    expect(results[1].shakes.length).toBe(0)
  })
  it('投入は材料の数 (n/3) を出して音を鳴らす', () => {
    const r = recorder()
    playIntake(r.host, pot, 2)
    expect(r.popups.map((p) => p.text)).toEqual(['2/3'])
    expect(r.sounds).toEqual(['intake'])
  })
  it('煮込み開始・弾き・縁で消える・降ってくる、それぞれの音', () => {
    const r = recorder()
    playBrewStart(r.host, pot)
    playReject(r.host, pot.center)
    playWordGone(r.host, pot.center)
    playSpawn(r.host)
    expect(r.sounds).toEqual(['brewStart', 'reject', 'remove', 'land'])
  })
  it('煮込み開始の泡は、上向きに飛ぶ (真上は -π/2)', () => {
    const r = recorder()
    playBrewStart(r.host, pot)
    const { minAngle, maxAngle } = r.bursts[0]
    expect(minAngle).toBeLessThan(-Math.PI / 2)
    expect(maxAngle).toBeGreaterThan(-Math.PI / 2)
    expect(maxAngle!).toBeLessThan(0)
  })
})
