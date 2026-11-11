// src/games/scripts/game/DwarfBomb/meta.ts
import type { GameOutputVariable, GameScriptMeta } from '@/games/types'
import { suika } from './params'

// 書き込む変数 (ラベルは src/i18n/editor/maps/ScenarioMapMessages.ts の gameOutputs)
export const OUTPUT_PAYOUT: GameOutputVariable = { name: 'dwarfbomb_payout', perUser: true }
export const OUTPUT_DAY: GameOutputVariable = { name: 'dwarfbomb_day', perUser: true }

export const dwarfBombMeta: GameScriptMeta = {
  inputs: [{ key: 'mode', type: 'enum', options: suika, default: '' }],
  outputs: [OUTPUT_PAYOUT, OUTPUT_DAY],
}
