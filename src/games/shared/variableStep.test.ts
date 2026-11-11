// src/games/shared/variableStep.test.ts
import { describe, expect, it } from 'vitest'
import { buildVariableStep, outputVariableName, safeUserId } from './variableStep'

const perUser = { name: 'g_score', perUser: true }
const global = { name: 'g_total', perUser: false }

describe('safeUserId', () => {
  it('英数字と _ だけの ID はそのまま使う', () => {
    expect(safeUserId('u1a2B_3')).toBe('u1a2B_3')
  })
  it('変数名に使えない ID・空の ID は test に置き換える', () => {
    expect(safeUserId('おみくじBOT')).toBe('test')
    expect(safeUserId('a-1')).toBe('test')
    expect(safeUserId('')).toBe('test')
    expect(safeUserId(undefined)).toBe('test')
  })
})

describe('buildVariableStep', () => {
  it('ユーザー別の変数名を組み立て、; で区切った式にする', () => {
    const step = buildVariableStep(
      [
        { variable: perUser, value: 120 },
        { variable: global, value: 3 },
      ],
      'u42'
    )
    expect(step).toEqual({ kind: 'variable', delaySeconds: 0, message: 'g_score_u42 = 120; g_total = 3' })
  })

  it('数値を範囲内・小数第2位に丸める', () => {
    expect(buildVariableStep([{ variable: global, value: 1.2345 }]).message).toBe('g_total = 1.23')
    expect(buildVariableStep([{ variable: global, value: 9e12 }]).message).toBe('g_total = 999999999')
    expect(buildVariableStep([{ variable: global, value: NaN }]).message).toBe('g_total = 0')
  })

  it('outputVariableName', () => {
    expect(outputVariableName(perUser, 'u9')).toBe('g_score_u9')
    expect(outputVariableName(global, 'u9')).toBe('g_total')
  })
})
