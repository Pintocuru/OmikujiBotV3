// src/i18n/editor/category/NavigationSidebarCategoriesMessages.ts
export const navigationSidebarCategoriesMessages = {
  ja: {
    categories: {
      jsonMerge: {
        label: 'JSONマージ(Dev)',
        description: 'ビルド時、jsonファイルをマージして出力します',
      },
      comments: {
        label: 'コメントイベント',
        description: 'チャット内容やユーザー情報を基におみくじを発動します',
      },
      timers: {
        label: 'タイマーイベント',
        description: '指定した時間経過で、自動的におみくじを発動します',
      },
      services: {
        label: '配信数値イベント',
        description: '配信の視聴数・高評価の変動でおみくじを発動します',
      },
      reactions: {
        label: 'リアクションイベント(Youtube)',
        description: '視聴者のリアクション（❤ 😄 🎉 😳 💯）でおみくじを発動します',
      },
      mikuji: {
        label: 'みくじ箱',
        description: 'おみくじの内容を作成します',
      },
      actions: {
        label: 'アクションセット',
        description: 'BOTのコメント・WordPartyの指定のプリセットを作成します',
      },
      placeholders: {
        label: 'プレースホルダー',
        description: 'コメントやタイマーで利用できる、高性能なプレースホルダーを設定します',
      },
      characters: {
        label: 'キャラクター',
        description: 'BOTメッセージのキャラクターや吹き出し・トーストの色を設定します',
      },
      ui: {
        label: 'アイテム',
        description: 'ジェネレーターで表示できる、アイテムの設定を行います',
      },
      dataPacks: {
        label: 'データパック',
        description: '配布されているデータパックを読み込みます',
      },
      appInfo: {
        label: 'アプリ情報',
        description: 'ライセンスや使用できる機能を確認できます',
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
      mikuji: {
        label: 'Omikuji Box',
        description: 'Creates the omikuji contents',
      },
      actions: {
        label: 'Action Sets',
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
      appInfo: {
        label: 'App Info',
        description: 'Check licenses and available features',
      },
    },
  },
} as const
