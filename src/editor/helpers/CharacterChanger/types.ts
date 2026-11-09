// src/editor/helpers/CharacterChanger/types.ts
import type { ScenarioType } from '@/types/OmikujiData/'

/**
 * キャラクター / iconKey の変更対象(シナリオ1件)
 */
export type FlowTarget = { category: 'scenarios'; item: ScenarioType }
