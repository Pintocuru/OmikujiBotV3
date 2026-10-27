// src/editor/presets/comments.ts
import { CommentTriggerSchema, OmikujiItemSchema } from '@/types/OmikujiData/'
import { generateId } from '@/types/core'
import { buildFortune, buildSimpleMikuji, buildWeightedMikuji, message } from './helpers'
import type { PresetDefinition } from './types'

/** おみくじ: 「おみくじ」コメントで結果をランダム表示 */
const omikuji: PresetDefinition<'comments'> = {
  id: 'omikuji',
  category: 'comments',
  build: () => {
    const key = generateId()
    const items = [
      ['大吉', 1],
      ['中吉', 3],
      ['小吉', 4],
      ['凶', 1],
    ] as const
    return {
      assets: {
        mikuji: [
          {
            key,
            name: 'おみくじ',
            omikuji: items.map(([name, weight]) =>
              OmikujiItemSchema.parse({
                name,
                lottery: { isPriority: false, weight },
                postFlows: [message(`<<user>> さんの運勢は【${name}】です！`)],
              })
            ),
          },
        ],
      },
      events: [
        {
          name: 'おみくじ',
          omikujiKey: key,
          trigger: CommentTriggerSchema.parse({ conditions: ['comment'], comment: ['おみくじ'] }),
        },
      ],
    }
  },
}

/** 除外: 指定ユーザー(配信者)のコメントをここで打ち切る */
const excludeUser: PresetDefinition<'comments'> = {
  id: 'excludeUser',
  category: 'comments',
  build: () => {
    const key = generateId()
    return {
      assets: {
        mikuji: [
          {
            key,
            name: 'おみくじ除外',
            omikuji: [
              OmikujiItemSchema.parse({
                name: '除外(処理終了)',
                kind: 'control',
                command: 'return',
              }),
            ],
          },
        ],
      },
      events: [
        {
          name: 'おみくじ除外(ユーザー名を設定してください)',
          omikujiKey: key,
          trigger: CommentTriggerSchema.parse({ conditions: ['username'], userName: [] }),
        },
      ],
      eventsToTop: true, // 通常のおみくじより先に判定させる
    }
  },
}

/** 占い: 「占い」コメントで今日の運勢とラッキーカラー/アイテムを返す */
const fortune: PresetDefinition<'comments'> = {
  id: 'fortune',
  category: 'comments',
  build: () => {
    const { key, mikuji, placeholders } = buildFortune()
    return {
      assets: { mikuji: [mikuji], placeholders },
      events: [
        {
          name: '占い',
          omikujiKey: key,
          trigger: CommentTriggerSchema.parse({ conditions: ['comment'], comment: ['占い'] }),
        },
      ],
    }
  },
}

/** 挨拶: 「こんにちは」などにランダムに返事 */
const greeting: PresetDefinition<'comments'> = {
  id: 'greeting',
  category: 'comments',
  build: () => {
    const { key, mikuji } = buildWeightedMikuji(
      '挨拶返し',
      [
        ['こんにちは', 3],
        ['ようこそ', 2],
        ['来てくれてありがとう', 1],
      ],
      (text) => `<<user>> さん、${text}！`
    )
    return {
      assets: { mikuji: [mikuji] },
      events: [
        {
          name: '挨拶',
          omikujiKey: key,
          trigger: CommentTriggerSchema.parse({
            conditions: ['comment'],
            comment: ['こんにちは', 'こんにちわ', 'こんばんは'],
          }),
        },
      ],
    }
  },
}

/** ダイス: 「ダイス」コメントで1〜6の目を返す(インラインのランダム構文を使用) */
const dice: PresetDefinition<'comments'> = {
  id: 'dice',
  category: 'comments',
  build: () => {
    const { key, mikuji } = buildSimpleMikuji('ダイス', [
      message("<<user>> さんの出目は <<'1','2','3','4','5','6'>> です"),
    ])
    return {
      assets: { mikuji: [mikuji] },
      events: [
        {
          name: 'ダイス',
          omikujiKey: key,
          trigger: CommentTriggerSchema.parse({ conditions: ['comment'], comment: ['ダイス'] }),
        },
      ],
    }
  },
}

export const commentPresets = [omikuji, fortune, dice, greeting, excludeUser]
