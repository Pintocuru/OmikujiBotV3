// src/editor/maps/apps/BaseSettingsEditor.ts

export const baseSettingsMessages = {
  ja: {
    key: {
      label: 'キーの名前を変更する',
      description: '他のデータと区別できるよう名前を付けます',
    },
    isEnabled: {
      label: 'イベントを有効にする',
      description: '有効にすると、おみくじができます',
    },
    name: {
      label: 'イベント名',
      description: '識別しやすい名前',
    },
    description: {
      label: '説明',
      description: 'このデータの紹介文',
    },
  },
  // 将来的に英語など他言語を追加する場合はここに記述
  // en: { ... }
} as const
