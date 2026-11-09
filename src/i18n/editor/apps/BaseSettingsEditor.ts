// src/i18n/editor/apps/BaseSettingsEditor.ts
// BaseEditor.vue が t('baseSettings.xxx.label') で参照する。
// 必ず最上位キーを `baseSettings` で包むこと（包まないと key / name / description が最上位に漏れる）

export const baseSettingsMessages = {
  ja: {
    baseSettings: {
      key: {
        label: 'キー名',
        edit: 'キーの名前を変更する',
        description: '他のデータと区別できるよう名前を付けます',
      },
      isEnabled: {
        label: '有効にする',
        description: 'おみくじのON/OFF',
      },
      // イベントにもアセット(みくじ箱・シナリオなど)にも使われるので、「イベント名」とは書かない
      name: {
        label: '名前',
        description: '識別しやすい名前',
      },
      description: {
        label: '説明',
        description: 'このデータの紹介文',
      },
      tags: {
        label: 'タグ',
        description: 'このデータに関連するタグ',
        placeholder: 'タグを追加',
        add: '追加',
        suggestions: '候補(クリックで追加)',
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
      name: {
        label: 'Name',
        description: 'A name that is easy to identify',
      },
      description: {
        label: 'Description',
        description: 'A short introduction for this data',
      },
      tags: {
        label: 'Tags',
        description: 'Add tags related to this data',
        placeholder: 'Add a tag',
        add: 'Add',
        suggestions: 'Suggestions (click to add)',
      },
    },
  },
} as const
