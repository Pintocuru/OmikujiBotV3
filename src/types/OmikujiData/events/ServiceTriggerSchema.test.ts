// src/types/OmikujiData/events/ServiceTriggerSchema.test.ts
import { describe, expect, it } from 'vitest'
import { ServiceConditionSchema, ServiceTriggerSchema } from './ServiceTriggerSchema'

describe('ServiceTriggerSchema', () => {
  it('condition が無いときは、変化したら発火する upVote になる', () => {
    expect(ServiceTriggerSchema.parse({})).toEqual({ condition: 'upVote', upVote: { comparison: 'changed' } })
  })

  it('選ばれた condition のフィールドだけを残す', () => {
    const trigger = ServiceTriggerSchema.parse({
      condition: 'viewer',
      viewer: { comparison: 'loop', value: 10 },
      upVote: { comparison: 'changed' },
    })
    expect(trigger).toEqual({ condition: 'viewer', viewer: { comparison: 'loop', value: 10 } })
  })

  it('設定値の無い条件に初期値を入れる', () => {
    expect(ServiceTriggerSchema.parse({ condition: 'follower' })).toEqual({ condition: 'follower', follower: true })
    expect(ServiceTriggerSchema.parse({ condition: 'elapsedMinutes' })).toEqual({
      condition: 'elapsedMinutes',
      elapsedMinutes: 0,
    })
    expect(ServiceTriggerSchema.parse({ condition: 'viewer' })).toEqual({
      condition: 'viewer',
      viewer: { comparison: 'changed' },
    })
  })

  it('未知の condition は読めない', () => {
    expect(ServiceTriggerSchema.safeParse({ condition: 'unknown' }).success).toBe(false)
  })
})

describe('ServiceConditionSchema', () => {
  it('value が必要な比較条件で value が無いデータは読めない', () => {
    expect(ServiceConditionSchema.safeParse({ comparison: 'lowerBound' }).success).toBe(false)
    expect(ServiceConditionSchema.safeParse({ comparison: 'equal', value: -1 }).success).toBe(false)
    expect(ServiceConditionSchema.parse({ comparison: 'equal', value: 5 })).toEqual({ comparison: 'equal', value: 5 })
  })

  it('value が不要な比較条件では value を取り除く', () => {
    expect(ServiceConditionSchema.parse({ comparison: 'changed', value: 3 })).toEqual({ comparison: 'changed' })
  })
})
