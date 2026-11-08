// src/engine/VariablePlaceholder/VariableProcessor.test.ts
import { describe, expect, it } from 'vitest'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { VariablePlaceholderProcessor } from './VariableProcessor'

describe('VariablePlaceholderProcessor.run', () => {
  const setup = () => {
    const variable = new PlaceholderVariable()
    return { variable, processor: new VariablePlaceholderProcessor(variable) }
  }

  it('{{ }} なしの本文を、そのまま式として評価する', () => {
    const { variable, processor } = setup()
    processor.run("score = 100; name = 'さくら'")

    expect(variable.getAll()).toEqual({ score: 100, name: 'さくら' })
  })

  it('コメントを除いて評価する。改行は連結するだけなので、式は ; で区切る', () => {
    const { variable, processor } = setup()
    processor.run('a = 1; // 初期値\n/* まとめて */ b = a + 1;\n')

    expect(variable.getAll()).toEqual({ a: 1, b: 2 })
  })

  it('空の本文は何もしない', () => {
    const { variable, processor } = setup()
    processor.run('  // コメントだけ\n')

    expect(variable.getAll()).toEqual({})
  })

  it('評価できない本文 ({{ }} つきの旧形式など) は例外になる', () => {
    const { processor } = setup()

    expect(() => processor.run('{{a = 1}}')).toThrow()
  })
})
