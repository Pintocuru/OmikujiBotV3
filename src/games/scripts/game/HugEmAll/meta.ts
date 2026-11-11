// src/games/scripts/game/HugEmAll/meta.ts
import type { GameOutputVariable, GameScriptMeta } from '@/games/types'
import { gameModes } from './params'

export const OUTPUT_PAYOUT: GameOutputVariable = { name: 'hugemall_payout', perUser: true }

export const hugEmAllMeta: GameScriptMeta = {
  inputs: [{ key: 'mode', type: 'enum', options: gameModes, default: '' }],
  outputs: [OUTPUT_PAYOUT],
}
