// src/i18n/editor/category/NavigationSidebarCategoriesMessages.ts
export const navigationSidebarCategoriesMessages = {
  ja: {
    categories: {
      jsonMerge: {
        label: 'JSONマージ(Dev)',
        description: 'ビルド時にJSONファイルをマージして出力',
      },
      comments: {
        label: 'コメントイベント',
        description: 'チャット内容やユーザー情報を基に発動',
      },
      timers: {
        label: 'タイマーイベント',
        description: '指定時間の経過後に自動発動',
      },
      services: {
        label: '配信数値イベント',
        description: '視聴者数や高評価数の変化で発動',
      },
      reactions: {
        label: 'リアクションイベント(Youtube)',
        description: '視聴者のリアクションで発動',
      },
      pads: {
        label: 'ポン出しイベント',
        description: 'LiveConsoleのポン出しボタンで発動',
      },
      mikuji: {
        label: 'みくじ箱',
        description: 'おみくじの内容を設定',
      },
      scenarios: {
        label: 'シナリオ',
        description: 'BOTコメントやWordPartyのプリセットを作成',
      },
      placeholders: {
        label: 'プレースホルダー',
        description: 'コメントやタイマーで使うプレースホルダーを設定',
      },
      characters: {
        label: 'キャラクター',
        description: 'BOTメッセージのキャラクターと吹き出し・トーストの色を設定',
      },
      ui: {
        label: 'アイテム',
        description: 'ジェネレーターに表示するアイテムを設定',
      },
      dataPacks: {
        label: 'データパック',
        description: '配布データパックを読み込む',
      },
      orphans: {
        label: '使われていないアイテム',
        description: 'イベントから辿れないアイテムを検索・削除',
      },
      cooldown: {
        label: 'クールダウン一覧',
        description: 'すべてのおみくじのクールダウンを一覧・調整',
      },
      appInfo: {
        label: '設定 / アプリ情報',
        description: 'ジェネレーターとエディターの機能と制御',
      },
    },
  },
  en: {
    categories: {
      jsonMerge: {
        label: 'JSON Merge (Dev)',
        description: 'Merges and outputs JSON files at build time',
      },
      comments: {
        label: 'Comment Events',
        description: 'Triggers omikuji based on chat or user info',
      },
      timers: {
        label: 'Timer Events',
        description: 'Triggers omikuji automatically at specified intervals',
      },
      services: {
        label: 'Stream Stat Events',
        description: 'Triggers omikuji on viewer count/like changes',
      },
      reactions: {
        label: 'Reactions (YouTube)',
        description: 'Triggers omikuji on viewer reactions (❤ 😄 🎉 😳 💯)',
      },
      pads: {
        label: 'Pad Events',
        description: 'Triggers omikuji when a pad button is pressed in LiveConsole',
      },
      mikuji: {
        label: 'Omikuji Box',
        description: 'Creates the omikuji contents',
      },
      scenarios: {
        label: 'Scenarios',
        description: 'Creates presets for BOT comments and WordParty',
      },
      placeholders: {
        label: 'Placeholders',
        description: 'Configures high-performance placeholders for comments and timers',
      },
      characters: {
        label: 'Characters',
        description: 'Sets characters, speech bubble and toast colors for BOT messages',
      },
      ui: {
        label: 'Items',
        description: 'Configures items displayed in the generator',
      },
      dataPacks: {
        label: 'Data Packs',
        description: 'Load distributed data packs',
      },
      orphans: {
        label: 'Unused Items',
        description: 'Finds items that no event leads to, and lets you delete them',
      },
      cooldown: {
        label: 'Cooldown Overview',
        description: 'See the cooldown of every omikuji at once and adjust them in one place',
      },
      appInfo: {
        label: 'App Info',
        description: 'Check licenses and available features',
      },
    },
  },
} as const
