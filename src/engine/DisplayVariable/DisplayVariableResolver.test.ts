// src/engine/DisplayVariable/DisplayVariableResolver.test.ts
import { describe, expect, it } from 'vitest'
import { ScenarioStepMessageSchema, ScenarioStepVariableSchema } from '@/types/OmikujiData'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { DisplayVariableResolver } from './DisplayVariableResolver'

describe('DisplayVariableResolver', () => {
  const setup = () => {
    const variable = new PlaceholderVariable()
    variable.getEvaluator().set('score', 100)
    return new DisplayVariableResolver(variable)
  }

  it('[[key]] を変数の値に置き換える (前後の空白は無視)', () => {
    expect(setup().resolve('[[score]] 点 / [[ score ]] 点')).toBe('100 点 / 100 点')
  })

  it('未定義の変数は、そのまま残す', () => {
    expect(setup().resolve('[[nothing]] 点')).toBe('[[nothing]] 点')
  })

  it('message の本文と slots、wordParty、gameScript は置き換えるが、variable の本文は置き換えない', () => {
    const resolver = setup()
    const [message, variable] = resolver.processSteps([
      ScenarioStepMessageSchema.parse({ kind: 'message', message: '[[score]]', slots: { slot0: '[[score]]' } }),
      ScenarioStepVariableSchema.parse({ kind: 'variable', message: 'total = [[score]]' }),
    ])

    expect(message).toMatchObject({ message: '100', slots: { slot0: '100' } })
    expect(variable).toMatchObject({ message: 'total = [[score]]' })
  })
})
