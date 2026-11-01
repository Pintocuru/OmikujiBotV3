// src/i18n/editor/OmikujiDataMaps.ts
// 後方互換のための再エクスポート
// 各マップの翻訳メッセージは src/i18n/editor/maps/ 配下に分割されました
import { characterMapMessages } from './maps/CharacterMapMessages'
import { commonMapMessages } from './maps/CommonMapMessages'
import { eventMapMessages } from './maps/EventMapMessages'
import { scenarioMapMessages } from './maps/ScenarioMapMessages'
import { uiMapMessages } from './maps/UiMapMessages'

export const omikujiDataMapMessages = {
  ja: {
    mapText: {
      ...characterMapMessages.ja.mapText,
      ...scenarioMapMessages.ja.mapText,
      ...eventMapMessages.ja.mapText,
      ...uiMapMessages.ja.mapText,
      ...commonMapMessages.ja.mapText,
    },
  },
  en: {
    mapText: {
      ...characterMapMessages.en.mapText,
      ...scenarioMapMessages.en.mapText,
      ...eventMapMessages.en.mapText,
      ...uiMapMessages.en.mapText,
      ...commonMapMessages.en.mapText,
    },
  },
} as const
