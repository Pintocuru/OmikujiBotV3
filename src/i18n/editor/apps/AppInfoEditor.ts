// src/i18n/editor/apps/AppInfoEditor.ts
export const appInfoEditorMessages = {
  ja: {
    appInfoEditor: {
      appSettings: {
        title: 'アプリ設定',
        description: 'このおみくじBOT editorに関する設定です',
      },
      appFeatures: {
        title: '利用可能な機能',
        description: 'このバージョンで使えるUI・レイアウト・ゲームスクリプトです',
      },
      packageBasic: {
        title: '基本情報',
        description: 'このおみくじパッケージに関する情報です',
      },
      packageDistribution: {
        title: '配布情報',
        description: 'おみくじパッケージのライセンスや配布先の表示です',
      },
      packageSystem: {
        title: 'システム情報',
        description: 'このアプリ「おみくじBOT」の情報です',
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
          title: 'ゲームスクリプト',
          description: 'おみくじ結果に連動して動くゲーム演出',
          empty: '利用可能なゲームスクリプトはありません',
        },
      },
      settings: {
        generator: {
          title: 'ジェネレーター設定',
          description: 'UI・効果音など、配信挙動に関わる設定',
          commentType: {
            label: 'コメント購読タイプ',
            description: 'コメントを受け取るアプリを設定します(現在はわんコメのみ)',
            options: { OneComme: 'わんコメ' },
          },
          basicDelaySeconds: {
            label: '投稿の基本遅延時間',
            description: 'BOTメッセージの表示や投稿を遅延（秒）',
          },
          soundEnabled: {
            label: '効果音を鳴らす',
            description: 'BOTの効果音を再生するか',
            on: '音を鳴らす',
            off: 'ミュートする',
          },
        },
        editor: {
          title: 'エディター設定',
          description: 'エディターの見た目・動作・ライセンスなど、アプリ本体の設定',
          theme: {
            label: 'エディターテーマ',
            description: 'DaisyUiのカラーテーマを設定します',
            random: 'ランダム',
          },
          locale: {
            label: '言語(Language)',
            description: 'エディターの表示言語を設定します',
          },
          initialCategory: {
            label: '起動時に開くカテゴリ',
            description: '起動時に最初に開くカテゴリを設定します',
          },
        },
        common: {
          reset: 'デフォルト値に戻す',
          warning: '注意が必要な設定です',
        },
      },
    },
  },
  en: {
    appInfoEditor: {
      appSettings: {
        title: 'App Settings',
        description: 'Settings related to this configuration editor',
      },
      appFeatures: {
        title: 'Available Features',
        description: 'UI items, layouts, and game scripts available in this version',
      },
      packageBasic: {
        title: 'Basic Information',
        description: 'Information regarding this omikuji package',
      },
      packageDistribution: {
        title: 'Distribution Information',
        description: 'Displays the license and distribution details for the omikuji package',
      },
      packageSystem: {
        title: 'System Information',
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
          reset: 'Reset to default',
          warning: 'This setting requires caution',
        },
      },
    },
  },
} as const
