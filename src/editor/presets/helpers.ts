// src/editor/presets/helpers.ts
import { generateId } from '@/types/core'
import { MikujiBoxSchema, OmikujiItemSchema, ScenarioStepArraySchema } from '@/types/OmikujiData/'
import type { z } from 'zod'

type PostFlowInput = z.input<typeof ScenarioStepArraySchema>

/** postFlow を1件実行するだけのみくじ箱を作る(events の omikujiKey 用に key を返す) */
export const buildSimpleMikuji = (name: string, postFlows: PostFlowInput) => {
  const key = generateId()
  const mikuji = {
    key,
    name,
    omikuji: [OmikujiItemSchema.parse({ name, kind: 'steps', postFlows })],
  } satisfies Partial<z.infer<typeof MikujiBoxSchema>>
  return { key, mikuji }
}

/** 通常のメッセージ投稿 */
export const message = (text: string) => ({ kind: 'message' as const, message: text })

/** 重み付きの結果一覧から、みくじ箱を作る */
export const buildWeightedMikuji = (
  name: string,
  items: readonly (readonly [string, number])[],
  toMessage: (item: string) => string
) => {
  const key = generateId()
  const mikuji = {
    key,
    name,
    omikuji: items.map(([item, weight]) =>
      OmikujiItemSchema.parse({
        name: item,
        lottery: { isPriority: false, weight },
        postFlows: [message(toMessage(item))],
      })
    ),
  } satisfies Partial<z.infer<typeof MikujiBoxSchema>>
  return { key, mikuji }
}

/** 占い一式(みくじ箱 + ラッキーカラー/アイテムのプレースホルダー)。key は都度発行するので何度追加しても衝突しない */
export const buildFortune = () => {
  const colorKey = generateId()
  const itemKey = generateId()
  const { key, mikuji } = buildWeightedMikuji(
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
  return { key, mikuji, placeholders }
}
