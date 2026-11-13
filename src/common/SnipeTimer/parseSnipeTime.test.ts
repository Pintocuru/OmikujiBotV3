// src/common/SnipeTimer/parseSnipeTime.test.ts
import { describe, expect, it } from 'vitest'
import { alignSnipeTime, parseSnipeTime, type SnipeTimeLimits } from './parseSnipeTime'

const limits: SnipeTimeLimits = { minSeconds: 10, maxSeconds: 300, secondAdjust: 10 }
// 2026-11-13 21:00:03(ローカル時刻)
const now = () => new Date(2026, 10, 13, 21, 0, 3, 250)

const hms = (d: Date | null) => d && [d.getHours(), d.getMinutes(), d.getSeconds()].join(':')

describe('parseSnipeTime', () => {
  it('相対時間(30秒後)は 10 秒単位に切り上げる', () => {
    expect(hms(parseSnipeTime('30秒後', limits, now()))).toBe('21:0:40')
  })

  it('全角・分表記の相対時間(2分後)', () => {
    expect(hms(parseSnipeTime('２分後', limits, now()))).toBe('21:2:10')
  })

  it('時刻(21:03)', () => {
    expect(hms(parseSnipeTime('21:03', limits, now()))).toBe('21:3:0')
  })

  it('分だけ(5分)は次にその分になる時刻', () => {
    expect(hms(parseSnipeTime('5分', limits, now()))).toBe('21:5:0')
  })

  it('最大秒数を超える相対時間は最大に収める', () => {
    const target = parseSnipeTime('50分後', limits, now())!
    expect(Math.floor((target.getTime() - now().getTime()) / 1000)).toBeLessThanOrEqual(300)
  })

  it('最低秒数に満たなければ引き上げる', () => {
    const target = parseSnipeTime('21:00:05', limits, now())
    expect(target).not.toBeNull()
    expect(target!.getTime() - now().getTime()).toBeGreaterThanOrEqual(9000)
  })

  it('時刻の表記が無ければ null', () => {
    expect(parseSnipeTime('こんにちは', limits, now())).toBeNull()
  })
})

describe('alignSnipeTime', () => {
  it('現在時刻 + 30 秒を 10 秒単位にそろえる', () => {
    const base = now()
    const target = alignSnipeTime(new Date(base.getTime() + 30_000), limits, base)
    expect(hms(target)).toBe('21:0:40')
  })
})
