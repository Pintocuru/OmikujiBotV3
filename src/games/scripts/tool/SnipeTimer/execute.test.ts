// src/games/scripts/tool/SnipeTimer/execute.test.ts
import { describe, expect, it } from 'vitest'
import type { OmikenCommentType } from '@/types/OmikenComment'
import { SnipeTimerSlotMap } from '@/types/generator'
import { ExecuteScript } from './execute'

const omiken = (comment: string) => ({ comment }) as OmikenCommentType

describe('SnipeTimer', () => {
  it('時刻のあるコメントから、snipeTimer 宛ての message ステップを 1 つ作る', () => {
    const { steps } = new ExecuteScript().run('', '', omiken('30秒後'))
    expect(steps).toHaveLength(1)
    const step = steps[0]
    expect(step.kind).toBe('message')
    if (step.kind !== 'message') return
    expect(step.uiKey).toBe('snipeTimer')
    const target = Number(step.slots[SnipeTimerSlotMap.targetAt.slot])
    expect(target).toBeGreaterThan(Date.now())
  })

  it('時刻のないコメント・コメントなしは何もしない', () => {
    const script = new ExecuteScript()
    expect(script.run('', '', omiken('こんにちは')).steps).toEqual([])
    expect(script.run('', '').steps).toEqual([])
  })

  it('max を指定すると、それより先の時刻は収まる', () => {
    const { steps } = new ExecuteScript().run('max=60', '', omiken('50分後'))
    const step = steps[0]
    if (step?.kind !== 'message') throw new Error('step missing')
    const diff = Number(step.slots[SnipeTimerSlotMap.targetAt.slot]) - Date.now()
    expect(diff).toBeLessThanOrEqual(61_000)
  })
})
