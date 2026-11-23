// src/console/game/OshikuraChain/scripts/nuisanceConfig.test.ts
import { describe, expect, it } from 'vitest'
import {
  COMMON_CONFIG,
  DIFFICULTY_PROFILES,
  DIFFICULTY_LEVELS,
  NuisanceConfigSchema,
  createConfigForDifficulty,
  createDefaultConfig,
  parseConfig,
  sanitizeConfig,
} from './nuisanceConfig'

describe('難易度設定', () => {
  it('5段階の難易度から4つの調整値を導出する', () => {
    expect(DIFFICULTY_LEVELS).toEqual([1, 2, 3, 4, 5])
    expect(DIFFICULTY_PROFILES[1]).toMatchObject({
      initialSeconds: 3600,
      estimatedMinutes: 60,
    })
    expect(DIFFICULTY_PROFILES[5]).toMatchObject({
      initialSeconds: 600,
      estimatedMinutes: 10,
    })
    for (const level of DIFFICULTY_LEVELS) {
      const config = createConfigForDifficulty(level)
      expect(config.maxSeconds).toBe(COMMON_CONFIG.maxSeconds)
      expect(config.coefficientFloorPercent).toBe(10)
      expect(config.maxNuisances).toBe(30)
    }
  })

  it('既定値は中間難易度で、初見コメントの係数リセットは有効', () => {
    expect(createDefaultConfig()).toMatchObject({
      difficulty: 3,
      resetCoefficientOnFirst: true,
      initialSeconds: 1500,
    })
  })
})

describe('parseConfig', () => {
  it('空なら既定値。旧設定の未知の項目は無視する', () => {
    expect(parseConfig({})).toEqual({ config: createDefaultConfig(), error: null })
    const { config, error } = parseConfig({ bossInterval: 200, maxNuisances: 200, coefficientFloorPercent: 30 })
    expect(error).toBeNull()
    expect(config).toEqual(createDefaultConfig())
  })

  it('保存した難易度と初見リセット設定を読み込む', () => {
    const { config, error } = parseConfig({ difficulty: 5, resetCoefficientOnFirst: false })
    expect(error).toBeNull()
    expect(config).toMatchObject({
      difficulty: 5,
      initialSeconds: 600,
      resetCoefficientOnFirst: false,
    })
  })

  it('不正な難易度・型違いは既定値で始めて理由を返す', () => {
    const { config, error } = parseConfig({ difficulty: 6 })
    expect(config).toEqual(createDefaultConfig())
    expect(error).toContain('difficulty')
    expect(parseConfig({ resetCoefficientOnFirst: 'yes' }).error).toContain('resetCoefficientOnFirst')
  })

  it('以前のライフ制の設定も読み込める', () => {
    expect(parseConfig({ startLife: 100, drainMultiplier: 3 }).error).toBeNull()
  })
})

describe('sanitizeConfig', () => {
  it('難易度を有効な範囲に収め、共通値を固定する', () => {
    const config = sanitizeConfig({
      difficulty: 5,
      resetCoefficientOnFirst: false,
      maxSeconds: 99999,
      coefficientFloorPercent: 50,
      maxNuisances: 200,
    })
    expect(config).toEqual(createConfigForDifficulty(5, false))
  })

  it('不正な難易度は中間難易度に戻す', () => {
    expect(sanitizeConfig({ difficulty: 99 as never }).difficulty).toBe(3)
  })

  it('スキーマは保存する設定のみを受け付ける', () => {
    expect(NuisanceConfigSchema.safeParse({ difficulty: 3, resetCoefficientOnFirst: true }).success).toBe(true)
  })
})
