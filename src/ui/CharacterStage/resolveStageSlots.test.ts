// src/ui/CharacterStage/resolveStageSlots.test.ts
import { describe, it, expect } from 'vitest'
import { CharacterStageSchema } from '@/types/ui'
import { pickInRange, resolveStageSlots } from './resolveStageSlots'

const defaults = CharacterStageSchema.parse({})

describe('resolveStageSlots', () => {
  it('slots が空なら UI 設定の既定値', () => {
    const r = resolveStageSlots(undefined, defaults)
    expect(r).toMatchObject({ seconds: 10, xMin: 20, xMax: 80, yMin: 100, yMax: 100, scale: 1, motion: 'fade', clearPrevious: false, motionDuration: 1 })
  })
  it('文字列の数値・boolean を変換する', () => {
    const r = resolveStageSlots({ slot0: '3', slot1: '10', slot2: '30', slot5: '1.5', slot6: 'slideUp', slot7: 'true' }, defaults)
    expect(r).toMatchObject({ seconds: 3, xMin: 10, xMax: 30, scale: 1.5, motion: 'slideUp', clearPrevious: true })
  })
  it('0 秒は無期限として通る', () => {
    expect(resolveStageSlots({ slot0: 0 }, defaults).seconds).toBe(0)
  })
  it('不正値は既定値に落とす', () => {
    const r = resolveStageSlots({ slot0: 'abc', slot1: NaN, slot5: -2, slot6: 'nope' }, defaults)
    expect(r).toMatchObject({ seconds: 10, xMin: 20, scale: 1, motion: 'fade' })
  })
  it('最小 > 最大は入れ替え、範囲外は 0〜100 に収める', () => {
    const r = resolveStageSlots({ slot1: 90, slot2: 10, slot3: -5, slot4: 150 }, defaults)
    expect(r).toMatchObject({ xMin: 10, xMax: 90, yMin: 0, yMax: 100 })
  })
  it('モーション速度は秒数。空・不正値は 1、範囲外は 0.4〜5 に収める', () => {
    expect(resolveStageSlots({ slot8: '2.4' }, defaults).motionDuration).toBe(2.4)
    expect(resolveStageSlots({ slot8: '' }, defaults).motionDuration).toBe(1)
    expect(resolveStageSlots({ slot8: 'abc' }, defaults).motionDuration).toBe(1)
    expect(resolveStageSlots({ slot8: 0.1 }, defaults).motionDuration).toBe(0.4)
    expect(resolveStageSlots({ slot8: 99 }, defaults).motionDuration).toBe(5)
  })
})

describe('pickInRange', () => {
  it('同じ値なら固定、違えば範囲内', () => {
    expect(pickInRange(50, 50, () => 0.9)).toBe(50)
    expect(pickInRange(0, 100, () => 0.25)).toBe(25)
  })
})
