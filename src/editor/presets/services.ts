// src/editor/presets/services.ts
import { ServiceTriggerSchema } from '@/types/OmikujiData/'
import { buildSimpleMikuji, message } from './helpers'
import type { PresetDefinition } from './types'

/** 高評価が過去最大を更新するたびにお知らせ */
const upVotePeak: PresetDefinition<'services'> = {
  id: 'upVotePeak',
  category: 'services',
  build: () => {
    const { key, mikuji, scenarios } = buildSimpleMikuji('高評価 過去最大', [
      message('高評価が過去最大になりました！(<<upVote>>)'),
    ])
    return {
      assets: { mikuji: [mikuji], scenarios },
      events: [
        {
          name: '高評価 過去最大',
          mikujiKey: key,
          trigger: ServiceTriggerSchema.parse({ condition: 'upVote', upVote: { comparison: 'greaterThanPeak' } }),
        },
      ],
    }
  },
}

/** 同時接続数が10の倍数を超えるたびに祝福 */
const viewerEvery10: PresetDefinition<'services'> = {
  id: 'viewerEvery10',
  category: 'services',
  build: () => {
    const { key, mikuji, scenarios } = buildSimpleMikuji('同時接続 10ごと', [
      message('同時接続数が <<viewer>> 人に！ありがとうございます！'),
    ])
    return {
      assets: { mikuji: [mikuji], scenarios },
      events: [
        {
          name: '同時接続 10ごと',
          mikujiKey: key,
          trigger: ServiceTriggerSchema.parse({ condition: 'viewer', viewer: { comparison: 'loop', value: 10 } }),
        },
      ],
    }
  },
}

/** フォロワーが増えたらお礼 */
const followerUp: PresetDefinition<'services'> = {
  id: 'followerUp',
  category: 'services',
  build: () => {
    const { key, mikuji, scenarios } = buildSimpleMikuji('フォロー感謝', [
      message('フォローありがとうございます！(<<follower>>人)'),
    ])
    return {
      assets: { mikuji: [mikuji], scenarios },
      events: [
        {
          name: 'フォロー感謝',
          mikujiKey: key,
          trigger: ServiceTriggerSchema.parse({ condition: 'follower', follower: true }),
        },
      ],
    }
  },
}

export const servicePresets = [upVotePeak, viewerEvery10, followerUp]
