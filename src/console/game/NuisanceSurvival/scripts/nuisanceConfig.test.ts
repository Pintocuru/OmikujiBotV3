// src/console/game/NuisanceSurvival/scripts/nuisanceConfig.test.ts
import { describe, expect, it } from 'vitest'
import {
  CONFIG_LIMITS,
  CONFIG_PRESETS,
  CONFIG_PRESET_IDS,
  NuisanceConfigSchema,
  createDefaultConfig,
  findMatchingPreset,
  parseConfig,
  sanitizeConfig,
} from './nuisanceConfig'

describe('parseConfig', () => {
  it('空なら既定値、項目が足りないだけなら足りない項目だけが既定値 (エラーにしない)', () => {
    expect(parseConfig({})).toEqual({ config: createDefaultConfig(), error: null })
    const { config, error } = parseConfig({ bossInterval: 200 })
    expect(error).toBeNull()
    expect(config.bossInterval).toBe(200)
    expect(config.maxNuisances).toBe(CONFIG_LIMITS.maxNuisances.default)
  })

  it('範囲外・型違いは、既定値で始めて理由を返す (黙って直さない)', () => {
    const { config, error } = parseConfig({ maxSeconds: 99999 })
    expect(config).toEqual(createDefaultConfig())
    expect(error).toContain('maxSeconds')
    expect(parseConfig({ maxNuisances: 1.5 }).error).toContain('maxNuisances')
  })

  it('以前の設定 (ライフ制のときの項目) が残っていても、無視して読める', () => {
    const { config, error } = parseConfig({ startLife: 100, drainMultiplier: 3, maxNuisances: 20 })
    expect(error).toBeNull()
    expect(config.maxNuisances).toBe(20)
    expect(config).not.toHaveProperty('startLife')
  })
})

describe('sanitizeConfig', () => {
  it('範囲に収める。数字でない項目は既定値、上限の数は四捨五入', () => {
    const config = sanitizeConfig({
      maxSeconds: 99999,
      maxNuisances: 12.6,
      iconSeconds: 0,
      wordSeconds: Number.NaN,
      coefficientFloorPercent: '5',
    })
    expect(config.maxSeconds).toBe(CONFIG_LIMITS.maxSeconds.max)
    expect(config.maxNuisances).toBe(13)
    expect(config.iconSeconds).toBe(CONFIG_LIMITS.iconSeconds.min)
    expect(config.wordSeconds).toBe(CONFIG_LIMITS.wordSeconds.default)
    expect(config.coefficientFloorPercent).toBe(CONFIG_LIMITS.coefficientFloorPercent.default)
    expect(config.bossInterval).toBe(CONFIG_LIMITS.bossInterval.default)
  })

  it('残り時間の上限の既定値は、15 分', () => {
    expect(createDefaultConfig().maxSeconds).toBe(900)
  })
})

describe('プリセット', () => {
  it('どのプリセットも、スキーマと範囲に収まっている', () => {
    for (const id of CONFIG_PRESET_IDS) {
      expect(NuisanceConfigSchema.safeParse(CONFIG_PRESETS[id]).success).toBe(true)
      expect(sanitizeConfig(CONFIG_PRESETS[id])).toEqual(CONFIG_PRESETS[id])
    }
  })

  it('入力欄の値がプリセットと一致するときだけ、そのプリセットが分かる', () => {
    expect(findMatchingPreset(CONFIG_PRESETS.merciless)).toBe('merciless')
    expect(findMatchingPreset({ ...CONFIG_PRESETS.merciless, maxSeconds: 301 })).toBeNull()
  })
})
