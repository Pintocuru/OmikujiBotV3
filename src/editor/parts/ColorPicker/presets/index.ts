// src/editor/parts/ColorPicker/presets/index.ts
import { CUTE_THEMES } from './cute'
import { COOL_THEMES } from './cool'
import { CYBER_THEMES } from './cyber'
import { RETRO_THEMES } from './retro'
import { DARK_THEMES } from './dark'
import { COZY_THEMES } from './cozy'
import type { ColorTheme } from './types'

export type { ColorSet, ColorTheme } from './types'

// プリセットのタブ定義。key は i18n(editorUi.colorPicker.tabs.<key>)と対応する
export const COLOR_PRESET_TABS = [
  { key: 'cute', themes: CUTE_THEMES },
  { key: 'cool', themes: COOL_THEMES },
  { key: 'cyber', themes: CYBER_THEMES },
  { key: 'retro', themes: RETRO_THEMES },
  { key: 'dark', themes: DARK_THEMES },
  { key: 'cozy', themes: COZY_THEMES },
] as const satisfies readonly { key: string; themes: readonly ColorTheme[] }[]

export type PresetTabKey = (typeof COLOR_PRESET_TABS)[number]['key']
