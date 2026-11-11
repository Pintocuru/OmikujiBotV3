// src/games/scripts/game/DwarfBomb/execute.test.ts
import { describe, expect, it } from 'vitest'
import { ExecuteScript } from './execute'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { VariablePlaceholderProcessor } from '@/engine/VariablePlaceholder/VariableProcessor'

describe('DwarfBomb execute', () => {
  it('結果を variable ステップ(先頭)で返し、変数名は宣言どおりユーザー別になる', () => {
    const { steps } = new ExecuteScript().run('', 'chara', { userId: 'u7', userName: 'テスト' } as never)
    const first = steps[0]
    expect(first.kind).toBe('variable')
    if (first.kind !== 'variable') return
    expect(first.message).toMatch(/^dwarfbomb_payout_u7 = -?\d+(\.\d+)?; dwarfbomb_day_u7 = \d+$/)
  })

  it('コメントなしのときは userId = test の変数名になる', () => {
    const first = new ExecuteScript().run('', 'chara').steps[0]
    expect(first.kind === 'variable' && first.message).toContain('dwarfbomb_payout_test = ')
  })

  it('返した variable ステップを、実際の評価ブロック処理で評価できる', () => {
    const { steps } = new ExecuteScript().run('', 'chara', { userId: 'u7', userName: 'テスト' } as never)
    const first = steps[0]
    if (first.kind !== 'variable') throw new Error('variable ステップではありません')

    const variable = new PlaceholderVariable()
    new VariablePlaceholderProcessor(variable).run(first.message)

    expect(Object.keys(variable.getAll()).sort()).toEqual(['dwarfbomb_day_u7', 'dwarfbomb_payout_u7'])
  })
})
