// src/console/game/NuisanceSurvival/scripts/nuisanceTraits.test.ts
import { describe, expect, it } from 'vitest'
import { BOSS_TRAITS, TRAIT_RANGES, getBossTraits, getNuisanceTraits } from './nuisanceTraits'

describe('getNuisanceTraits', () => {
  it('同じ userId なら、いつも同じ見た目になる', () => {
    expect(getNuisanceTraits('alice')).toEqual(getNuisanceTraits('alice'))
  })

  it('動かない種類で、大きさと色は範囲に収まる', () => {
    for (let i = 0; i < 300; i++) {
      const t = getNuisanceTraits(`user-${i}`)
      expect(t.kind).toBe('static')
      expect(t.baseSize).toBeGreaterThanOrEqual(TRAIT_RANGES.baseSize[0])
      expect(t.baseSize).toBeLessThanOrEqual(TRAIT_RANGES.baseSize[1])
      expect(t.hue).toBeGreaterThanOrEqual(0)
      expect(t.hue).toBeLessThan(360)
    }
  })

  it('色は、userId ごとにばらける', () => {
    const hues = new Set(Array.from({ length: 100 }, (_, i) => getNuisanceTraits(`user-${i}`).hue))
    expect(hues.size).toBeGreaterThan(30)
  })
})

describe('getBossTraits', () => {
  it('ボスは大きい。色は、同じ userId の通常のアイコンと同じ', () => {
    const boss = getBossTraits('alice')
    expect(boss.kind).toBe('boss')
    expect(boss.baseSize).toBe(BOSS_TRAITS.baseSize)
    expect(boss.hue).toBe(getNuisanceTraits('alice').hue)
  })
})
