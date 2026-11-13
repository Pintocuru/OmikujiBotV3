// src/games/scripts/tool/SnipeTimer/meta.ts
import { SNIPE_SECOND_ADJUSTS } from '@/common/SnipeTimer/parseSnipeTime'
import type { GameScriptMeta } from '@/games/types'
import { DEFAULT_LIMITS } from './params'

// 表示用のメッセージを出すだけなので、書き込む変数はない
export const snipeTimerMeta: GameScriptMeta = {
  inputs: [
    { key: 'min', type: 'number', min: 1, max: 600, default: DEFAULT_LIMITS.minSeconds },
    { key: 'max', type: 'number', min: 10, max: 43200, default: DEFAULT_LIMITS.maxSeconds },
    {
      key: 'adjust',
      type: 'enum',
      options: SNIPE_SECOND_ADJUSTS.map(String),
      default: String(DEFAULT_LIMITS.secondAdjust),
    },
  ],
  outputs: [],
}
