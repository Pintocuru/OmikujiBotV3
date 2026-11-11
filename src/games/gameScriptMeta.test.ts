// src/games/gameScriptMeta.test.ts
import { describe, expect, it } from 'vitest'
import { gameScriptKeys } from '@/types/OmikujiData'
import { scenarioMapMessages } from '@/i18n/editor/maps/ScenarioMapMessages'
import { getGameScriptMeta } from './gameScriptMeta'

type Messages = {
  mapText: { gameParams: Record<string, Record<string, unknown>>; gameOutputs: Record<string, Record<string, unknown>> }
}
const messages = scenarioMapMessages as unknown as { ja: Messages; en: Messages }

describe('ゲームスクリプトの宣言', () => {
  it.each(gameScriptKeys)('%s: 入力欄と出力変数の文言が ja / en にある', (key) => {
    const meta = getGameScriptMeta(key)
    for (const lang of ['ja', 'en'] as const) {
      for (const input of meta.inputs) {
        expect(messages[lang].mapText.gameParams[key]?.[input.key], `${lang} ${key}.${input.key}`).toBeDefined()
      }
      for (const output of meta.outputs) {
        expect(messages[lang].mapText.gameOutputs[key]?.[output.name], `${lang} ${key}.${output.name}`).toBeDefined()
      }
    }
  })

  it('enum の既定値は、選択肢に含まれる', () => {
    for (const key of gameScriptKeys) {
      for (const input of getGameScriptMeta(key).inputs) {
        if (input.type === 'enum') expect(input.options, `${key}.${input.key}`).toContain(input.default)
      }
    }
  })
})
