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
    const { config, error } = parseConfig({ startLife: 200 })
    expect(error).toBeNull()
    expect(config.startLife).toBe(200)
    expect(config.maxNuisances).toBe(CONFIG_LIMITS.maxNuisances.default)
  })

  it('範囲外・型違いは、既定値で始めて理由を返す (黙って直さない)', () => {
    const { config, error } = parseConfig({ growthMultiplier: 99 })
    expect(config).toEqual(createDefaultConfig())
    expect(error).toContain('growthMultiplier')
    expect(parseConfig({ maxNuisances: 1.5 }).error).toContain('maxNuisances')
  })
})

describe('sanitizeConfig', () => {
  it('範囲に収める。数字でない項目は既定値、上限の数は四捨五入', () => {
    const config = sanitizeConfig({
      startLife: 99999,
      maxNuisances: 12.6,
      growthMultiplier: 0.2,
      growthIntervalSeconds: Number.NaN,
      drainMultiplier: '5',
    })
    expect(config.startLife).toBe(CONFIG_LIMITS.startLife.max)
    expect(config.maxNuisances).toBe(13)
    expect(config.bossInterval).toBe(CONFIG_LIMITS.bossInterval.default)
    expect(config.growthMultiplier).toBe(CONFIG_LIMITS.growthMultiplier.min)
    expect(config.growthIntervalSeconds).toBe(CONFIG_LIMITS.growthIntervalSeconds.default)
    expect(config.drainMultiplier).toBe(CONFIG_LIMITS.drainMultiplier.default)
    expect(config.pushMultiplier).toBe(CONFIG_LIMITS.pushMultiplier.default)
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
    expect(findMatchingPreset({ ...CONFIG_PRESETS.merciless, startLife: 110 })).toBeNull()
  })
})
