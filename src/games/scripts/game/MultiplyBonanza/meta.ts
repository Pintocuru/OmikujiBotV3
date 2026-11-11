// src/games/scripts/game/MultiplyBonanza/meta.ts
import type { GameOutputVariable, GameScriptMeta } from '@/games/types'
import { suika } from './params'

export const OUTPUT_PAYOUT: GameOutputVariable = { name: 'multiplybonanza_payout', perUser: true }

export const multiplyBonanzaMeta: GameScriptMeta = {
  inputs: [{ key: 'mode', type: 'enum', options: suika, default: '' }],
  outputs: [OUTPUT_PAYOUT],
}
