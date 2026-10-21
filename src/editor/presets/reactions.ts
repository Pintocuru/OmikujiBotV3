// src/editor/presets/reactions.ts
import { ReactionTriggerSchema } from '@/types/OmikujiData/'
import { buildSimpleMikuji, message } from './helpers'
import type { PresetDefinition } from './types'

/** 最大レベル到達時に盛り上がりを伝える */
const maxLevel: PresetDefinition<'reactions'> = {
  id: 'maxLevel',
  category: 'reactions',
  build: () => {
    const { key, mikuji } = buildSimpleMikuji('盛り上がってる', [message('盛り上がってる～')])
    return {
      assets: { mikuji: [mikuji] },
      events: [
        {
          name: '最大レベル達成',
          omikujiKey: key,
          trigger: ReactionTriggerSchema.parse({ comparison: 'burstReach', value: 1, triggerLevel: 3 }),
        },
      ],
    }
  },
}

/** ハートが盛り上がったらお礼 */
const heartBurst: PresetDefinition<'reactions'> = {
  id: 'heartBurst',
  category: 'reactions',
  build: () => {
    const { key, mikuji } = buildSimpleMikuji('ハートありがとう', [message('ハートありがとう！')])
    return {
      assets: { mikuji: [mikuji] },
      events: [
        {
          name: 'ハート盛り上がり',
          omikujiKey: key,
          trigger: ReactionTriggerSchema.parse({
            reactions: ['heart'],
            comparison: 'burstReach',
            value: 1,
            triggerLevel: 1,
          }),
        },
      ],
    }
  },
}

export const reactionPresets = [maxLevel, heartBurst]
