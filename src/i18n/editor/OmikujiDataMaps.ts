// src/i18n/editor/OmikujiDataMaps.ts
import { characterMapMessages, commonMapMessages, eventMapMessages, scenarioMapMessages, uiMapMessages } from './maps'

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
