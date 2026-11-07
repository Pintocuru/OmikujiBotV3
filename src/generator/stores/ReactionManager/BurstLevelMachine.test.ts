import { describe, expect, it, vi } from 'vitest'
import { BurstLevelMachine } from './BurstLevelMachine'

describe('BurstLevelMachine', () => {
  it('starts with no pending level changes', () => {
    const machine = new BurstLevelMachine()

    expect(machine.reachedLevel).toBeNull()
    expect(machine.droppedLevel).toBeNull()
  })

  it('records and consumes a reached level', () => {
    const machine = new BurstLevelMachine()

    machine.add(8, 30)

    expect(machine.level).toBe(1)
    expect(machine.reachedLevel).toBe(1)

    machine.consumeReached()

    expect(machine.reachedLevel).toBeNull()
  })

  it('records a dropped level and consumes it', () => {
    const machine = new BurstLevelMachine()
    machine.add(8, 30)

    expect(machine.decrement()).toBe(0)
    expect(machine.droppedLevel).toBe(0)
    expect(machine.reachedLevel).toBeNull()

    machine.consumeDropped()

    expect(machine.droppedLevel).toBeNull()
  })

  it('resets pending changes without removing callbacks', () => {
    const machine = new BurstLevelMachine()
    const callback = vi.fn()
    machine.onChange(callback)
    machine.add(8, 30)
    machine.decrement()

    machine.reset()

    expect(machine.level).toBe(0)
    expect(machine.reachedLevel).toBeNull()
    expect(machine.droppedLevel).toBeNull()

    machine.add(8, 30)
    expect(callback).toHaveBeenCalledTimes(3)
  })
})
