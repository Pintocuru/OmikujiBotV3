// src/games/scripts/tool/FortuneRanking/meta.ts
import type { GameScriptMeta } from '@/games/types'
import { DEFAULT_PROJECT_NAME, resolveFortuneConfig } from './params'

// 書き込む変数は fruits / projectName で決まる (例: fortune_strawberry = 順位)
export const fortuneRankingMeta: GameScriptMeta = {
  inputs: [
    { key: 'projectName', type: 'text', default: DEFAULT_PROJECT_NAME },
    { key: 'fruits', type: 'text' }, // ラベル:キー,ラベル:キー,... 空なら既定の10種
  ],
  outputs: [],
  dynamicOutputs: (values) => {
    const { projectName, fruitPairs } = resolveFortuneConfig(values)
    return fruitPairs.map(({ label, key }) => ({ name: `${projectName}_${key}`, perUser: false, label }))
  },
}
