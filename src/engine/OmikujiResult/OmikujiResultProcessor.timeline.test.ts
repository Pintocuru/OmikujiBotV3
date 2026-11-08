// src/engine/OmikujiResult/OmikujiResultProcessor.timeline.test.ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  OmikujiDataSchema,
  ScenarioStepMessageSchema,
  ScenarioStepVariableSchema,
  type ScenarioStepType,
} from '@/types/OmikujiData'
import type { BotMessageType } from '@/types/generator'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { OmikujiResultProcessor } from '@/engine/OmikujiResult/OmikujiResultProcessor'

// わんコメへの投稿とエラー通知は、この検証には不要なので差し替える
vi.mock('@/engine/PostOmikuji/PostOmikujiService', () => ({
  PostOmikujiService: class {
    post = vi.fn(async () => undefined)
  },
}))
vi.mock('@/generator/scripts/Notice/showNotice', () => ({
  showErrorNotice: vi.fn(),
  describeError: (error: unknown) => String(error),
}))

const variable = (delaySeconds: number, message: string) =>
  ScenarioStepVariableSchema.parse({ kind: 'variable', delaySeconds, message })
const message = (delaySeconds: number, text: string) =>
  ScenarioStepMessageSchema.parse({ kind: 'message', delaySeconds, message: text })

const bubbleText = (m: BotMessageType) => ('bubble' in m ? m.bubble?.message : undefined)

describe('OmikujiResultProcessor.processTimeline', () => {
  const omikujiData = OmikujiDataSchema.parse({})
  const basicDelaySeconds = omikujiData.settings.generator.basicDelaySeconds ?? 1
  let placeholderVariable: PlaceholderVariable
  let processor: OmikujiResultProcessor
  let deferred: BotMessageType[]

  const run = (steps: ScenarioStepType[]) =>
    processor.processTimeline(steps, {}, undefined, (messages) => deferred.push(...messages))
  const getVar = (key: string) => placeholderVariable.getAll()[key]

  beforeEach(() => {
    vi.useFakeTimers()
    placeholderVariable = new PlaceholderVariable()
    processor = new OmikujiResultProcessor(omikujiData, async () => null, placeholderVariable)
    deferred = []
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('delaySeconds が 0 の評価ブロックは、呼び出し中に評価される', async () => {
    const { messages, handled } = await run([variable(0, '{{a = 5}}'), message(0, '{{a}}')])

    expect(getVar('a')).toBe(5)
    expect(messages.map(bubbleText)).toEqual(['5'])
    expect(handled).toBe(true)
  })

  it('delaySeconds が 0 より大きい評価ブロックは、その時刻まで評価されない', async () => {
    await run([variable(5, '{{a = 5}}')])

    expect(getVar('a')).toBeUndefined()
    await vi.advanceTimersByTimeAsync(4999)
    expect(getVar('a')).toBeUndefined()
    await vi.advanceTimersByTimeAsync(1)
    expect(getVar('a')).toBe(5)
  })

  it('メッセージは、その時刻の変数の値で評価され、出力の遅れは basicDelaySeconds だけになる', async () => {
    const { messages } = await run([
      variable(0, '{{a = 1}}'),
      message(2, '{{a}}'),
      variable(3, '{{a = 2}}'),
      message(5, '{{a}}'),
    ])
    expect(messages).toEqual([])

    await vi.advanceTimersByTimeAsync(5000)

    expect(deferred.map(bubbleText)).toEqual(['1', '2'])
    expect(deferred.every((m) => m.delaySeconds === basicDelaySeconds)).toBe(true)
  })

  it('時刻が同じステップは、並べた順に実行される', async () => {
    await run([variable(1, '{{a = 1}}'), variable(1, '{{a = a * 10 + 2}}'), message(1, '{{a}}')])
    await vi.advanceTimersByTimeAsync(1000)

    expect(deferred.map(bubbleText)).toEqual(['12'])
  })

  it('最初のメッセージが遅延でも handled になる。変数だけなら handled にならない', async () => {
    const delayedMessage = await run([message(3, 'こんにちは')])
    expect(delayedMessage.messages).toEqual([])
    expect(delayedMessage.handled).toBe(true)

    const variableOnly = await run([variable(0, '{{a = 1}}'), variable(2, '{{b = 1}}')])
    expect(variableOnly.messages).toEqual([])
    expect(variableOnly.handled).toBe(false)
  })
})
