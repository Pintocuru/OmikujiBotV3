// src/engine/OmikujiResult/ProcessVariables.test.ts
// 評価ブロック {{ }} を含む message が、評価後の本文で「わんコメ投稿」と「吹き出し」の両方に渡ることの回帰テスト
import { describe, expect, it, vi } from 'vitest'

const posted: string[] = []
vi.mock('@/engine/PostOmikuji/PostOmikujiService', () => ({
  PostOmikujiService: class {
    post(targets: any[]) {
      // PostOmikujiService の cleanPostMessage と同じ処理 (残った {{ }} は投稿時に消える)
      for (const t of targets)
        if (t.kind === 'message') posted.push(t.message.replace(/\{\{[^}]+\}\}/g, '').replace(/<<[^>]+>>/g, '').trim())
    }
  },
}))

import { OmikujiDataSchema, PlaceholderSchema } from '@/types/OmikujiData'
import { PlaceholderVariable } from '@/engine/types/VariablePlaceholder'
import { BotMessageGenerator } from './BotMessageGenerator'
import { PostActionsHandler } from './PostActionsHandler'

const placeholder = (key: string, values: unknown[]) => PlaceholderSchema.parse({ id: key, key, name: key, values })

const setup = () => {
  vi.spyOn(console, 'warn').mockImplementation(() => {})
  posted.length = 0
  const data = OmikujiDataSchema.parse({ meta: { generatorName: 'omikuji-bot', generatorVersion: '1', dataVersion: 3 } })
  data.assets.placeholders = {
    lottery: placeholder('BigBangLottery', ["{{text='<<BigBangDecoB>>凶'}}<<BigBangB4>>!!!!"]),
    deco: placeholder('BigBangDecoB', ['魑魅']),
    b4: placeholder('BigBangB4', ['{{ra1}}瞬息{{ra2}}弾指{{ra3}}刹那']),
  }
  const variable = new PlaceholderVariable()
  const handler = new PostActionsHandler(data, variable, new BotMessageGenerator(data, variable))
  return { handler, variable }
}

const messageFlow = (message: string) =>
  ({ kind: 'message', delaySeconds: 0, characterKey: null, iconKey: 'default', sound: '', soundPath: '', message }) as any

describe('processVariables: 評価後の本文を使う', () => {
  it('投稿・吹き出し・Ranking のすべてに評価結果が反映される', () => {
    const { handler, variable } = setup()
    const message = '{{ra1 = rand(1,9); ra2 = rand(1,9); ra3 = rand(1,9);}}\n<<user>>の運勢は【[[text]]】、希少度は<<BigBangLottery>>'

    const bots = handler.process([messageFlow(message)], { user: 'テストユーザー' }, undefined, true)

    const expected = /^テストユーザーの運勢は【魑魅凶】、希少度は\d瞬息\d弾指\d刹那!!!!$/
    expect(posted).toHaveLength(1)
    expect(posted[0]).toMatch(expected)

    const comment = bots.find((b: any) => b.type === 'comment') as any
    expect(comment.bubble.message).toMatch(expected)
    expect(bots.some((b: any) => b.type === 'extra')).toBe(true) // text から Ranking
    expect(Object.keys(variable.getAll())).toEqual(['ra1', 'ra2', 'ra3'])
  })

  it('評価ブロックだけのメッセージは吹き出しを作らない (変数は更新される)', () => {
    const { handler, variable } = setup()

    const bots = handler.process([messageFlow('{{n = 5}}')], {}, undefined, true)

    expect(bots).toEqual([])
    expect(variable.getAll()).toEqual({ n: 5 })
  })
})
