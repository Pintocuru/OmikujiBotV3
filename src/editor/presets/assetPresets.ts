// src/editor/presets/assetPresets.ts  mikuji / actions / placeholders
import { PostFlowArraySchema } from '@/types/OmikujiData/'
import { buildFortune, buildWeightedMikuji, message } from './helpers'
import type { PresetDefinition } from './types'

/** mikuji */
const omikuji5: PresetDefinition<'mikuji'> = {
  id: 'omikuji5',
  category: 'mikuji',
  build: () => {
    const { mikuji } = buildWeightedMikuji(
      'おみくじ(5段階)',
      [
        ['大吉', 1],
        ['中吉', 3],
        ['小吉', 4],
        ['末吉', 3],
        ['凶', 1],
      ],
      (r) => `<<user>> さんの運勢は【${r}】です！`
    )
    return { assets: { mikuji: [mikuji] } }
  },
}

const fortune: PresetDefinition<'mikuji'> = {
  id: 'fortune',
  category: 'mikuji',
  build: () => {
    const { mikuji, placeholders } = buildFortune()
    return { assets: { mikuji: [mikuji], placeholders } } // mikuji を先頭にして作成後に選択させる
  },
}

const coinToss: PresetDefinition<'mikuji'> = {
  id: 'coinToss',
  category: 'mikuji',
  build: () => {
    const { mikuji } = buildWeightedMikuji(
      'コイントス',
      [
        ['表', 1],
        ['裏', 1],
      ],
      (r) => `<<user>> さんのコイントスは【${r}】！`
    )
    return { assets: { mikuji: [mikuji] } }
  },
}

export const mikujiPresets = [omikuji5, fortune, coinToss]

/** actions */
const thanks: PresetDefinition<'actions'> = {
  id: 'thanks',
  category: 'actions',
  build: () => ({
    assets: {
      actions: [
        {
          name: 'お礼',
          postFlows: PostFlowArraySchema.parse([
            message('<<user>> さん、ありがとうございます！'),
            { ...message('また来てくださいね'), delaySeconds: 2 },
          ]),
        },
      ],
    },
  }),
}

const cheer: PresetDefinition<'actions'> = {
  id: 'cheer',
  category: 'actions',
  build: () => ({
    assets: {
      actions: [
        { name: '応援', postFlows: PostFlowArraySchema.parse([message('みんなで盛り上がっていきましょう！')]) },
      ],
    },
  }),
}

export const actionPresets = [thanks, cheer]

/** placeholders */
const make = (id: string, name: string, values: string[]): PresetDefinition<'placeholders'> => ({
  id,
  category: 'placeholders',
  build: () => ({ assets: { placeholders: [{ name, values }] } }),
})

export const placeholderPresets = [
  make('luckyColor', 'ラッキーカラー', ['赤', '青', '黄', '緑', '紫', '白', '黒', 'ピンク', 'オレンジ']),
  make('luckyItem', 'ラッキーアイテム', ['ハンカチ', '観葉植物', 'コーヒー', '傘', 'イヤホン', 'メガネ', '手帳']),
  make('cheerWord', '応援メッセージ', ['いいね！', 'その調子！', 'ナイス！', 'がんばれ！']),
]
