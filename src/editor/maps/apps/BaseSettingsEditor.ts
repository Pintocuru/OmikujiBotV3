// src/editor/maps/apps/BaseSettingsEditor.ts
// BaseEditor.vue が t('baseSettings.xxx.label') で参照する。
// 必ず最上位キーを `baseSettings` で包むこと（包まないと key / name / description が最上位に漏れる）

export const baseSettingsMessages = {
  ja: {
    baseSettings: {
      key: {
        label: 'キーの名前を変更する',
        description: '他のデータと区別できるよう名前を付けます',
      },
      isEnabled: {
        label: 'イベントを有効にする',
        description: '有効にすると、おみくじができます',
      },
      // BaseEditor.vue は t('baseSettings.eventName.*') を参照している
      eventName: {
        label: 'イベント名',
        description: '識別しやすい名前',
      },
      description: {
        label: '説明',
        description: 'このデータの紹介文',
      },
    },
  },
  en: {
    baseSettings: {
      key: {
        label: 'Change key name',
        description: 'Give it a name to distinguish it from other data',
      },
      isEnabled: {
        label: 'Enable this event',
        description: 'When enabled, omikuji can be drawn',
      },
      eventName: {
        label: 'Event name',
        description: 'A name that is easy to identify',
      },
      description: {
        label: 'Description',
        description: 'A short introduction for this data',
      },
    },
  },
} as const
