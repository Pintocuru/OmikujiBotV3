// src/console/game/OshikuraChain/render/StarField.test.ts
import { describe, expect, it } from 'vitest'
import { CHAIN_FOR_MAX_SPEED, IDLE_SPEED, MAX_SPEED, StarField } from './StarField'

const seeded = () => {
  let x = 12345
  return () => ((x = (x * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff)
}

describe('StarField.targetSpeed', () => {
  it('連鎖なしは待機の速さ、上限の連鎖で最大、それ以上は増えない', () => {
    expect(StarField.targetSpeed(0)).toBe(IDLE_SPEED)
    expect(StarField.targetSpeed(CHAIN_FOR_MAX_SPEED)).toBe(MAX_SPEED)
    expect(StarField.targetSpeed(CHAIN_FOR_MAX_SPEED * 5)).toBe(MAX_SPEED)
  })

  it('連鎖が増えるほど速い', () => {
    expect(StarField.targetSpeed(6)).toBeGreaterThan(StarField.targetSpeed(3))
  })
})

describe('StarField.update', () => {
  it('連鎖が続くと速くなり、切れると(上がるより)ゆっくり戻る', () => {
    const field = new StarField(704, 512, seeded())
    for (let i = 0; i < 30; i++) field.update(1 / 60, 12)
    const fast = field.speed
    expect(fast).toBeGreaterThan(IDLE_SPEED * 4)
    field.update(1 / 60, 0)
    expect(field.speed).toBeLessThan(fast)
    expect(field.speed).toBeGreaterThan(IDLE_SPEED * 4)
  })

  it('長い時間をまとめて渡しても、1 フレームぶんしか進まない', () => {
    const a = new StarField(704, 512, seeded())
    const b = new StarField(704, 512, seeded())
    a.update(100, 0)
    b.update(0.1, 0)
    expect(a.speed).toBeCloseTo(b.speed)
  })
})
