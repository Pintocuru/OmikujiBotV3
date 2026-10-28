// src/generator/scripts/EventProcess/PadProcessor.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const loadStatus = vi.fn()
const executeOmikuji = vi.fn(async () => [])
const scheduleBotMessages = vi.fn()
const pads: Record<string, unknown> = {}

vi.mock('@/manager/services/padApi', () => ({ padApi: { loadStatus: (...args: unknown[]) => loadStatus(...args) } }))
vi.mock('@/generator/stores/useAppStore', () => ({
  useAppStore: () => ({ data: { events: { pads } }, scheduleBotMessages }),
}))
vi.mock('@/generator/scripts/EventProcess/OmikujiProcessor', () => ({
  OmikujiProcessor: class {
    executeOmikuji = executeOmikuji
  },
}))

import { EventPadProcessor, PAD_POLL_INTERVAL_MS } from './PadProcessor'

const pad = (key: string, padId: string, order = 1, isEnabled = true) => ({
  key,
  omikujiKey: `box-${key}`,
  order,
  isEnabled,
  trigger: { padId },
})

const tick = async () => {
  await vi.advanceTimersByTimeAsync(PAD_POLL_INTERVAL_MS)
}

describe('EventPadProcessor', () => {
  let processor: EventPadProcessor

  beforeEach(() => {
    vi.useFakeTimers()
    loadStatus.mockReset()
    executeOmikuji.mockClear()
    scheduleBotMessages.mockClear()
    for (const key of Object.keys(pads)) delete pads[key]
    Object.assign(pads, {
      a: pad('a', 'pad-1', 2),
      b: pad('b', 'pad-1', 1),
      c: pad('c', 'pad-2'),
      d: pad('d', 'pad-1', 3, false),
    })
    processor = new EventPadProcessor()
  })

  afterEach(() => {
    processor.stopPads()
    vi.useRealTimers()
  })

  it('最初の問い合わせは since なし。過去の発火は再生しない', async () => {
    loadStatus.mockResolvedValue({ hasNew: false, firedAt: 1000, padId: null })
    processor.startPads()
    await vi.advanceTimersByTimeAsync(0)

    expect(loadStatus).toHaveBeenCalledWith(undefined)
    expect(executeOmikuji).not.toHaveBeenCalled()
  })

  it('次の問い合わせは lastSeen を since に付ける', async () => {
    loadStatus.mockResolvedValue({ hasNew: false, firedAt: 1000, padId: null })
    processor.startPads()
    await vi.advanceTimersByTimeAsync(0)
    await tick()

    expect(loadStatus).toHaveBeenLastCalledWith(1000)
  })

  it('新しい発火は、該当する有効なイベントだけを order 順に1回ずつ実行する', async () => {
    loadStatus.mockResolvedValueOnce({ hasNew: false, firedAt: 1000, padId: null })
    loadStatus.mockResolvedValueOnce({ hasNew: true, firedAt: 2000, padId: 'pad-1' })
    loadStatus.mockResolvedValue({ hasNew: false, firedAt: 2000, padId: null })

    processor.startPads()
    await vi.advanceTimersByTimeAsync(0)
    await tick()
    await tick()

    expect(executeOmikuji.mock.calls.map((c) => c[0])).toEqual(['b', 'a'])
    expect(executeOmikuji).toHaveBeenCalledWith('b', 'box-b', 'pads')
    expect(scheduleBotMessages).toHaveBeenCalledTimes(2)
    // 実行後は、更新した lastSeen で問い合わせる (二重発火しない)
    expect(loadStatus).toHaveBeenLastCalledWith(2000)
  })

  it('サーバーに接続できなくても止まらず、つながったら基準を取り直す', async () => {
    loadStatus.mockRejectedValueOnce(new Error('offline'))
    loadStatus.mockResolvedValue({ hasNew: true, firedAt: 3000, padId: 'pad-1' })

    processor.startPads()
    await vi.advanceTimersByTimeAsync(0)
    await tick()

    // 基準 (lastSeen) がまだ無いので、つながった最初の応答は基準として扱い、発火しない
    expect(loadStatus).toHaveBeenNthCalledWith(2, undefined)
    expect(executeOmikuji).not.toHaveBeenCalled()
  })

  it('stop したあとは問い合わせない', async () => {
    loadStatus.mockResolvedValue({ hasNew: false, firedAt: 0, padId: null })
    processor.startPads()
    await vi.advanceTimersByTimeAsync(0)
    processor.stopPads()
    loadStatus.mockClear()
    await tick()

    expect(loadStatus).not.toHaveBeenCalled()
  })
})
