// src/games/scripts/game/BomberSpin/meta.ts
import type { GameOutputVariable, GameScriptMeta } from '@/games/types'
import { symbol } from './params'

export const OUTPUT_PAYOUT: GameOutputVariable = { name: 'bomberspin_payout', perUser: true }

export const bomberSpinMeta: GameScriptMeta = {
  inputs: [
    { key: 'symbol', type: 'enum', options: symbol, default: '' },
    { key: 'spin', type: 'number', min: 3, max: 8 },
  ],
  outputs: [OUTPUT_PAYOUT],
}
