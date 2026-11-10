// src/i18n/editor/apps/AppInfoEditor.ts
export const appInfoEditorMessages = {
  ja: {
    appInfoEditor: {
      appSettings: {
        label: 'アプリ設定',
        description: 'おみくじBOTエディターの設定',
      },
      appFeatures: {
        label: '利用可能な機能',
        description: 'このバージョンで使えるUI・レイアウト・スクリプト',
      },
      packageBasic: {
        label: '基本情報',
        description: 'おみくじパッケージの情報',
      },
      packageDistribution: {
        label: '配布情報',
        description: 'おみくじパッケージのライセンスと配布先',
      },
      packageSystem: {
        label: 'システム情報',
        description: 'おみくじBOTの情報',
      },
      features: {
        ui: {
          title: 'UI(アイテム)',
          description: 'ジェネレーターで表示できるUI',
          empty: '利用可能なUIはありません',
        },
        layout: {
          title: 'レイアウト',
          description: 'UIの配置プリセット',
          empty: '利用可能なレイアウトはありません',
        },
        gameScript: {
          title: 'スクリプト',
          description: '複雑な処理でミニゲーム等を実現します',
          empty: '利用可能なスクリプトはありません',
        },
      },
      settings: {
        generator: {
          title: 'ジェネレーター設定',
          description: 'UI・効果音など、配信挙動に関わる設定',
          commentType: {
            label: 'コメント購読タイプ',
            description: 'コメントを受け取るアプリ（現在はわんコメのみ）',
            options: { OneComme: 'わんコメ' },
          },
          basicDelaySeconds: {
            label: '投稿の基本遅延時間',
            description: 'BOTメッセージの表示や投稿を遅延（秒）',
          },
          soundEnabled: {
            label: '効果音を鳴らす',
            description: 'ジェネレーターで鳴る効果音を再生するか',
            on: '音を鳴らす',
            off: 'ミュートする',
          },
          showCooldownNotice: {
            label: 'クールダウンのブロック通知',
            description: 'ブロックされたとき、ジェネレーターの右下にトースト表示',
            on: '表示する',
            off: '表示しない',
          },
        },
        editor: {
          title: 'エディター設定',
          description: 'エディターの見た目・動作・ライセンス',
          theme: {
            label: 'エディターテーマ',
            description: '説明不要',
            random: '🎲',
          },
          locale: {
            label: '言語(Language)',
            description: 'エディターの表示言語',
          },
          initialCategory: {
            label: '起動時に開くカテゴリ',
            description: '起動時に開くカテゴリ',
          },
        },
        common: {
          help: 'ヘルプを開く',
          reset: 'デフォルト値に戻す',
          warning: '注意が必要な設定です',
        },
      },
    },
  },
  en: {
    appInfoEditor: {
      appSettings: {
        label: 'App Settings',
        description: 'Settings related to this configuration editor',
      },
      appFeatures: {
        label: 'Available Features',
        description: 'UI items, layouts, and game scripts available in this version',
      },
      packageBasic: {
        label: 'Basic Information',
        description: 'Information regarding this omikuji package',
      },
      packageDistribution: {
        label: 'Distribution Information',
        description: 'Displays the license and distribution details for the omikuji package',
      },
      packageSystem: {
        label: 'System Information',
        description: 'Information about the "Omikuji Bot" application',
      },
      features: {
        ui: {
          title: 'UI Items',
          description: 'UI items the generator can display',
          empty: 'No UI items are available',
        },
        layout: {
          title: 'Layouts',
          description: 'Preset arrangements for UI items',
          empty: 'No layouts are available',
        },
        gameScript: {
          title: 'Game Scripts',
          description: 'Game effects that play along with omikuji results',
          empty: 'No game scripts are available',
        },
      },
      settings: {
        generator: {
          title: 'Generator Settings',
          description: 'Settings that affect streaming behavior, such as UI and sound effects',
          commentType: {
            label: 'Comment Source',
            description: 'Choose the app that provides comments (OneComme only for now)',
            options: { OneComme: 'OneComme' },
          },
          basicDelaySeconds: {
            label: 'Base Post Delay',
            description: 'Delay (in seconds) before BOT messages are shown or posted',
          },
          soundEnabled: {
            label: 'Play Sound Effects',
            description: 'Whether to play BOT sound effects',
            on: 'Sound on',
            off: 'Muted',
          },
          showCooldownNotice: {
            label: 'Cooldown Block Notice',
            description:
              'When a comment\'s omikuji is blocked by a cooldown, shows "<name> was blocked" at the bottom right of the stream screen (viewers can see it)',
            on: 'Show',
            off: 'Hide',
          },
        },
        editor: {
          title: 'Config Editor Settings',
          description: 'Settings for the app itself, such as appearance and behavior',
          theme: {
            label: 'Editor Theme',
            description: 'Set the DaisyUI color theme',
            random: 'Random',
          },
          locale: {
            label: 'Language',
            description: 'Set the display language of the editor',
          },
          initialCategory: {
            label: 'Category Opened on Startup',
            description: 'Set the category that opens first on startup',
          },
        },
        common: {
          help: 'Open help',
          reset: 'Reset to default',
          warning: 'This setting requires caution',
        },
      },
    },
  },
} as const
