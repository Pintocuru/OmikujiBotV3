// src/games/scripts/game/GouseiSuika/meta.ts
import type { GameOutputVariable, GameScriptMeta } from '@/games/types'
import { life, suika } from './params'

export const OUTPUT_POINTS: GameOutputVariable = { name: 'gouseisuika_points', perUser: true }

export const gouseiSuikaMeta: GameScriptMeta = {
  inputs: [
    { key: 'mode', type: 'enum', options: suika, default: suika[0] },
    { key: 'life', type: 'number', min: 1, max: 99, default: life },
  ],
  outputs: [OUTPUT_POINTS],
}
