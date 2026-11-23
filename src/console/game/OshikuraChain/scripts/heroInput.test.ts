// src/console/game/OshikuraChain/scripts/heroInput.test.ts
import { describe, expect, it } from 'vitest'
import { NO_INPUT, isMoveKey, resolveInput } from './heroInput'

describe('resolveInput', () => {
  it('WASD が、上・左・下・右', () => {
    expect(resolveInput(['KeyW'])).toEqual({ dx: 0, dy: -1 })
    expect(resolveInput(['KeyA'])).toEqual({ dx: -1, dy: 0 })
    expect(resolveInput(['KeyS'])).toEqual({ dx: 0, dy: 1 })
    expect(resolveInput(['KeyD'])).toEqual({ dx: 1, dy: 0 })
  })

  it('何も押していなければ止まる。複数押していれば、最後に押したキーが優先 (斜めにはならない)', () => {
    expect(resolveInput([])).toEqual(NO_INPUT)
    expect(resolveInput(['KeyW', 'KeyD'])).toEqual({ dx: 1, dy: 0 })
    expect(resolveInput(['KeyD', 'KeyW'])).toEqual({ dx: 0, dy: -1 })
  })

  it('関係ないキーは無視する', () => {
    expect(resolveInput(['KeyW', 'KeyH'])).toEqual({ dx: 0, dy: -1 })
    expect(isMoveKey('KeyW')).toBe(true)
    expect(isMoveKey('KeyH')).toBe(false)
  })
})
