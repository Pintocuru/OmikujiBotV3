// src/editor/presets/helpers.ts
import { generateId } from '@/types/core'
import { MikujiBoxSchema, OmikujiItemSchema, ScenarioStepRecordSchema, ScenarioStepSchema } from '@/types/OmikujiData/'
import type { z } from 'zod'

type StepsInput = z.input<typeof ScenarioStepSchema>[]

/** ステップの配列から、シナリオ保存用の steps(Record)を作る。id は都度発行する */
export const stepsRecord = (steps: StepsInput) =>
  ScenarioStepRecordSchema.parse(
    Object.fromEntries(
      steps.map((step) => {
        const id = generateId()
        return [id, { ...step, id }]
      })
    )
  )

/** シナリオ(assets.scenarios)を作る。key は都度発行する */
export const buildScenario = (name: string, steps: StepsInput) => ({
  key: generateId(),
  name,
  steps: stepsRecord(steps),
})

/** シナリオを実行するみくじアイテム(kind: 'steps')。weight 省略時は通常アイテムの既定値 */
const stepsItem = (name: string, scenarioKey: string, weight?: number) =>
  OmikujiItemSchema.parse({
    name,
    kind: 'steps',
    scenarioKey,
    ...(weight === undefined ? {} : { lottery: { isPriority: false, weight } }),
  })

/**
 * ステップを1件実行するだけのみくじ箱を作る(events の omikujiKey 用に key を返す)
 * - シナリオも作るので、assets に mikuji と scenarios の両方を渡すこと(mikuji を先頭にすると作成後に選択される)
 */
export const buildSimpleMikuji = (name: string, steps: StepsInput) => {
  const key = generateId()
  const scenario = buildScenario(name, steps)
  const mikuji = {
    key,
    name,
    omikuji: [stepsItem(name, scenario.key)],
  } satisfies Partial<z.infer<typeof MikujiBoxSchema>>
  return { key, mikuji, scenarios: [scenario] }
}

/** 通常のメッセージ投稿 */
export const message = (text: string) => ({ kind: 'message' as const, message: text })

/** 重み付きの結果一覧から、みくじ箱を作る(結果ごとに1つのシナリオを作る) */
export const buildWeightedMikuji = (
  name: string,
  items: readonly (readonly [string, number])[],
  toMessage: (item: string) => string
) => {
  const key = generateId()
  const scenarios = items.map(([item]) => buildScenario(`${name}: ${item}`, [message(toMessage(item))]))
  const mikuji = {
    key,
    name,
    omikuji: items.map(([item, weight], index) => stepsItem(item, scenarios[index].key, weight)),
  } satisfies Partial<z.infer<typeof MikujiBoxSchema>>
  return { key, mikuji, scenarios }
}

/** 占い一式(みくじ箱 + シナリオ + ラッキーカラー/アイテムのプレースホルダー)。key は都度発行するので何度追加しても衝突しない */
export const buildFortune = () => {
  const colorKey = generateId()
  const itemKey = generateId()
  const { key, mikuji, scenarios } = buildWeightedMikuji(
    '今日の運勢',
    [
      ['大吉', 1],
      ['吉', 4],
      ['中吉', 3],
      ['凶', 1],
    ],
    (fortune) =>
      `<<user>> さんの今日の運勢は【${fortune}】！ラッキーカラーは<<${colorKey}>>、ラッキーアイテムは<<${itemKey}>>です`
  )
  const placeholders = [
    { key: colorKey, name: 'ラッキーカラー', values: ['赤', '青', '黄', '緑', '紫', '白', '黒', 'ピンク', 'オレンジ'] },
    {
      key: itemKey,
      name: 'ラッキーアイテム',
      values: ['ハンカチ', '観葉植物', 'コーヒー', '傘', 'イヤホン', 'メガネ', '手帳'],
    },
  ]
  return { key, mikuji, scenarios, placeholders }
}
