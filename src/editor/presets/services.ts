// src/editor/presets/services.ts
import { ServiceTriggerSchema } from '@/types/OmikujiData/'
import { buildSimpleMikuji, message } from './helpers'
import type { PresetDefinition } from './types'

/** 高評価が過去最大を更新するたびにお知らせ */
const upVotePeak: PresetDefinition<'services'> = {
  id: 'upVotePeak',
  category: 'services',
  build: () => {
    const { key, mikuji } = buildSimpleMikuji('高評価 過去最大', [
      message('高評価が過去最大になりました！(<<upVote>>)'),
    ])
    return {
      assets: { mikuji: [mikuji] },
      events: [
        {
          name: '高評価 過去最大',
          omikujiKey: key,
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
    const { key, mikuji } = buildSimpleMikuji('同時接続 10ごと', [
      message('同時接続数が <<viewer>> 人に！ありがとうございます！'),
    ])
    return {
      assets: { mikuji: [mikuji] },
      events: [
        {
          name: '同時接続 10ごと',
          omikujiKey: key,
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
    const { key, mikuji } = buildSimpleMikuji('フォロー感謝', [
      message('フォローありがとうございます！(<<follower>>人)'),
    ])
    return {
      assets: { mikuji: [mikuji] },
      events: [
        {
          name: 'フォロー感謝',
          omikujiKey: key,
          trigger: ServiceTriggerSchema.parse({ condition: 'follower', follower: true }),
        },
      ],
    }
  },
}

/** 配信開始から60分でお知らせ */
const elapsed60: PresetDefinition<'services'> = {
  id: 'elapsed60',
  category: 'services',
  build: () => {
    const { key, mikuji } = buildSimpleMikuji('配信1時間', [
      message('配信開始から1時間が経ちました。ここまでありがとうございます！'),
    ])
    return {
      assets: { mikuji: [mikuji] },
      events: [
        {
          name: '配信1時間',
          omikujiKey: key,
          trigger: ServiceTriggerSchema.parse({ condition: 'elapsedMinutes', elapsedMinutes: 60 }),
        },
      ],
    }
  },
}

export const servicePresets = [upVotePeak, viewerEvery10, followerUp, elapsed60]
