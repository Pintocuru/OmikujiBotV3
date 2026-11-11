// src/games/scripts/game/GoogolClover/meta.ts
import type { GameOutputVariable, GameScriptMeta } from '@/games/types'

export const OUTPUT_SCORE: GameOutputVariable = { name: 'googolclover_score', perUser: true }

// パラメータはなし (手入力欄と、使える変数だけが表示される)
export const googolCloverMeta: GameScriptMeta = {
  inputs: [],
  outputs: [OUTPUT_SCORE],
}
