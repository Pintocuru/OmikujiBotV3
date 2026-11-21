// src/console/game/NuisanceSurvival/scripts/nuisanceTraits.test.ts
import { describe, expect, it } from 'vitest'
import {
  BOSS_TRAITS,
  SPECIAL_KIND_WEIGHTS,
  TRAIT_RANGES,
  getBossTraits,
  getNuisanceTraits,
  type NuisanceKind,
} from './nuisanceTraits'
import { createRng, hashString } from './rng'

describe('hashString / createRng', () => {
  it('同じ入力なら同じ値、違う入力なら (ほぼ) 違う値', () => {
    expect(hashString('u1abc')).toBe(hashString('u1abc'))
    expect(hashString('u1abc')).not.toBe(hashString('u1abd'))
    const a = createRng(1)
    const b = createRng(1)
    expect([a(), a(), a()]).toEqual([b(), b(), b()])
  })
})

describe('getNuisanceTraits', () => {
  it('同じ userId なら、いつも同じ性質', () => {
    expect(getNuisanceTraits('u1x2y3')).toEqual(getNuisanceTraits('u1x2y3'))
  })

  it('性質は、範囲に収まる。bomber だけが導火線と爆発を持つ', () => {
    for (let i = 0; i < 2000; i++) {
      const t = getNuisanceTraits(`u${i.toString(36)}`)
      expect(t.baseSize).toBeGreaterThanOrEqual(TRAIT_RANGES.baseSize[0])
      expect(t.baseSize).toBeLessThanOrEqual(TRAIT_RANGES.baseSize[1])
      expect(t.pushSeconds).toBeGreaterThanOrEqual(TRAIT_RANGES.pushSeconds[0])
      expect(t.pushSeconds).toBeLessThanOrEqual(TRAIT_RANGES.pushSeconds[1])
      expect(t.hue).toBeGreaterThanOrEqual(0)
      expect(t.hue).toBeLessThan(360)
      expect(t.moveIntervalSeconds).toBeGreaterThan(0)
      if (t.kind === 'bomber') {
        expect(t.fuseSeconds).not.toBeNull()
        expect(t.explosionDamage).toBeGreaterThanOrEqual(TRAIT_RANGES.explosionDamage[0])
        expect(t.drainPerSecond).toBeLessThanOrEqual(TRAIT_RANGES.bomberDrainPerSecond[1])
      } else {
        expect(t.fuseSeconds).toBeNull()
        expect(t.explosionDamage).toBe(0)
        expect(t.drainPerSecond).toBeGreaterThanOrEqual(TRAIT_RANGES.drainPerSecond[0])
      }
    }
  })

  it('特殊能力の内訳は、設定した割合に近い割合で出る (userId が変わると、性質も変わる)', () => {
    const counts: Record<NuisanceKind, number> = {
      static: 0,
      wanderer: 0,
      evader: 0,
      creeper: 0,
      bouncer: 0,
      bomber: 0,
      boss: 0,
    }
    const total = 5000
    for (let i = 0; i < total; i++) counts[getNuisanceTraits(`u${(i * 7919).toString(36)}`).kind]++
    expect(counts.static).toBe(0) // 割合を省略すると、全員が特殊能力を持つ
    for (const [kind, weight] of SPECIAL_KIND_WEIGHTS) {
      expect(counts[kind] / total).toBeGreaterThan(weight * 0.8)
      expect(counts[kind] / total).toBeLessThan(weight * 1.2)
    }
  })

  it('特殊能力の割合: 0 なら全員 static、割合どおりに特殊能力持ちが出る', () => {
    const total = 5000
    let special = 0
    for (let i = 0; i < total; i++) {
      const id = `u${(i * 7919).toString(36)}`
      expect(getNuisanceTraits(id, 0).kind).toBe('static')
      if (getNuisanceTraits(id, 0.2).kind !== 'static') special++
    }
    expect(special / total).toBeGreaterThan(0.2 * 0.85)
    expect(special / total).toBeLessThan(0.2 * 1.15)
  })

  it('割合を上げても、すでに特殊能力を持つ人の種類は変わらない', () => {
    for (let i = 0; i < 1000; i++) {
      const id = `u${(i * 7919).toString(36)}`
      const low = getNuisanceTraits(id, 0.2)
      if (low.kind !== 'static') expect(getNuisanceTraits(id, 0.6).kind).toBe(low.kind)
    }
  })
})

describe('getBossTraits', () => {
  it('ボスは、大きく・重く・爆発する。色だけは userId で決まり、同じなら同じ', () => {
    const boss = getBossTraits('u1x2y3')
    expect(boss.kind).toBe('boss')
    expect(boss.baseSize).toBe(BOSS_TRAITS.baseSize)
    expect(boss.fuseSeconds).toBe(BOSS_TRAITS.fuseSeconds)
    expect(boss.explosionDamage).toBe(BOSS_TRAITS.explosionDamage)
    expect(boss.hue).toBe(getNuisanceTraits('u1x2y3').hue)
    expect(getBossTraits('u1x2y3')).toEqual(boss)
  })
})
