// src/ui/CharacterStage/buildStageItem.test.ts
import { describe, it, expect } from 'vitest'
import { CharacterStageSchema } from '@/types/ui'
import { resolveStageSlots } from './resolveStageSlots'
import { buildStageItem } from './buildStageItem'

const defaults = CharacterStageSchema.parse({})

describe('buildStageItem', () => {
  it('標準サイズに倍率をかけ、範囲内の位置を抽選する', () => {
    const spec = resolveStageSlots({ slot1: 0, slot2: 100, slot3: 50, slot4: 50, slot5: 1.5 }, defaults)
    const item = buildStageItem({ id: 'a', layers: ['x.png'], spec, characterSize: 200, z: 3, random: () => 0.25 })
    expect(item).toMatchObject({ id: 'a', size: 300, x: 25, y: 50, motion: 'fade', z: 3 })
    expect(item.display).toEqual({ visible: true, hideTimeout: undefined })
  })
})
