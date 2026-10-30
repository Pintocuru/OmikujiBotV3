// src/editor/presets/index.ts
import { DataCategoryType } from '@/types/OmikujiData/'
import { commentPresets } from './comments'
import { timerPresets } from './timers'
import { servicePresets } from './services'
import { reactionPresets } from './reactions'
import { characterPresets } from './characters'
import { actionPresets, mikujiPresets, placeholderPresets } from './assetPresets'
import type { PresetDefinition } from './types'

/**
 * カテゴリ別プリセット一覧
 * 定義が無いカテゴリはメニュー自体が出ない
 */
const presetMap: Partial<Record<DataCategoryType, readonly PresetDefinition<any>[]>> = {
  comments: commentPresets,
  timers: timerPresets,
  services: servicePresets,
  reactions: reactionPresets,
  mikuji: mikujiPresets,
  scenarios: actionPresets,
  placeholders: placeholderPresets,
  characters: characterPresets,
}

export const getPresets = (category: DataCategoryType): readonly PresetDefinition[] => presetMap[category] ?? []
export type { PresetDefinition, PresetBuildResult } from './types'
