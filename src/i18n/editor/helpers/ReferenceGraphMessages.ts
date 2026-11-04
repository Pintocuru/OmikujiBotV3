// src/i18n/editor/helpers/ReferenceGraphMessages.ts
// helpers/referenceGraph(LinkGroup)の文言。キーは connections.* のまま(content / apps/cooldown の文言と同じ階層にマージされる)
export const referenceGraphMessages = {
  ja: {
    connections: {
      searching: '検索中…',
      scenarioMissing: 'シナリオが見つかりません({key})',
    },
  },
  en: {
    connections: {
      searching: 'Searching…',
      scenarioMissing: 'Scenario not found ({key})',
    },
  },
} as const
