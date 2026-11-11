// src/games/gameScriptVariables.test.ts
// 各ゲームが、宣言(meta.outputs)どおりの変数を variable ステップで返すこと
import { describe, expect, it } from 'vitest'
import type { OmikenCommentType } from '@/types/OmikenComment'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { VariablePlaceholderProcessor } from '@/engine/VariablePlaceholder/VariableProcessor'
import { outputVariableName } from '@/games/shared/variableStep'
import type { ScriptResult } from '@/games/types'
import { getGameScriptMeta } from './gameScriptMeta'
import { ExecuteScript as BomberSpin } from './scripts/game/BomberSpin/execute'
import { ExecuteScript as DwarfBomb } from './scripts/game/DwarfBomb/execute'
import { ExecuteScript as GoogolClover } from './scripts/game/GoogolClover/execute'
import { ExecuteScript as GouseiSuika } from './scripts/game/GouseiSuika/execute'
import { ExecuteScript as HugEmAll } from './scripts/game/HugEmAll/execute'
import { ExecuteScript as MultiplyBonanza } from './scripts/game/MultiplyBonanza/execute'
import { ExecuteScript as FortuneRanking } from './scripts/tool/FortuneRanking/execute'

const omiken = { userId: 'u7', userName: 'テスト' } as OmikenCommentType

const evaluate = (result: ScriptResult) => {
  const variableSteps = result.steps.filter((step) => step.kind === 'variable')
  expect(variableSteps).toHaveLength(1)
  const variable = new PlaceholderVariable()
  new VariablePlaceholderProcessor(variable).run(variableSteps[0].message)
  return variable.getAll()
}

describe.each([
  ['BomberSpin', () => new BomberSpin().run('', 'chara', omiken)],
  ['DwarfBomb', () => new DwarfBomb().run('', 'chara', omiken)],
  ['GouseiSuika', () => new GouseiSuika().run('', 'chara', omiken)],
  ['MultiplyBonanza', () => new MultiplyBonanza().run('', 'chara', omiken)],
  ['HugEmAll', () => new HugEmAll().run('', 'chara', omiken)],
  ['GoogolClover', () => new GoogolClover().run('', 'chara', omiken)],
] as const)('%s', (key, run) => {
  it('宣言した出力変数を、実際の評価ブロック処理で書き込める', () => {
    const written = evaluate(run() as ScriptResult)
    const expected = getGameScriptMeta(key).outputs.map((output) => outputVariableName(output, 'u7'))
    expect(Object.keys(written).sort()).toEqual([...expected].sort())
    for (const value of Object.values(written)) expect(typeof value).toBe('number')
  })
})

describe('FortuneRanking', () => {
  it('入力値で決まる出力変数の宣言が、実際に書き込まれる変数と一致する', () => {
    const query = 'projectName=luck&fruits=りんご:apple,ぶどう:grape'
    const written = evaluate(new FortuneRanking().run(query, 'chara'))
    const declared = getGameScriptMeta('FortuneRanking').dynamicOutputs?.({
      projectName: 'luck',
      fruits: 'りんご:apple,ぶどう:grape',
    })
    expect(declared?.map((output) => output.name).sort()).toEqual(Object.keys(written).sort())
  })

  it('空欄なら既定の10種になる', () => {
    const declared = getGameScriptMeta('FortuneRanking').dynamicOutputs?.({})
    expect(declared).toHaveLength(10)
    expect(declared?.[0]).toMatchObject({ name: 'fortune_strawberry', label: 'いちご' })
  })
})
