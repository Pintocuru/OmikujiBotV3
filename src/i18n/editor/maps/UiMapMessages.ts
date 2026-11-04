// src/i18n/editor/maps/UiMapMessages.ts
export const uiMapMessages = {
  ja: {
    mapText: {
      uiLayout: {
        commentBubble: {
          label: 'フキダシ',
          description: 'シンプルなフキダシでおみくじ結果を表示します。',
        },
        gameRanking: {
          label: 'ゲームランキング',
          description: 'スイカゲーム等の結果をランキングボード形式で表示します。',
        },
        sesupinTest: {
          label: 'テストレイアウト(管理者用)',
          description: 'すべて表示するレイアウト',
        },
      },
      uiKind: {
        characterStage: {
          label: 'キャラクターステージ',
          description: 'キャラクター画像だけを、指定した位置・秒数で表示します(演出用)。',
        },
        commentBubble: {
          label: 'フキダシ',
          description: 'BOTの発言内容を吹き出し形式で表示します。',
        },
        gameRanking: {
          label: 'ゲームランキング',
          description: 'スイカゲーム等の結果をランキングボード形式で表示します。',
        },
        cookieCounter: {
          label: 'クッキーカウンター',
          description: '配信のカウントをクッキー風のカウンターで表示します。',
        },
        kujibikiPanel: {
          label: 'くじ引きパネル',
          description: 'おみくじ・占いの結果をパネル形式で表示します。',
        },
        lifeHourglass: {
          label: '命の砂時計',
          description: '時間経過に応じて数字が増加するカウントアップカウンター',
        },
        liveClock: {
          label: 'ライブクロック',
          description: '時計とメッセージを表示します。',
        },
        streamCounter: {
          label: '配信カウンター',
          description: '同時接続数や高評価数などを表示します。',
        },
        toastWidgets: {
          label: 'トースト',
          description: '通知メッセージをトースト形式で表示します。',
        },
        userBoard: {
          label: 'ユーザーボード',
          description: 'ユーザーの得点・チームを、得点リストやチームのバー・スコアボードで表示します。',
        },
      },
    },
  },
  en: {
    mapText: {
      uiLayout: {
        commentBubble: {
          label: 'Speech bubble',
          description: 'Displays omikuji results in a simple speech bubble.',
        },
        gameRanking: {
          label: 'Game rankings',
          description: 'Displays results from games such as Suika Game in a ranking board.',
        },
        sesupinTest: {
          label: 'Test layout (admin only)',
          description: 'A layout that displays all UI items.',
        },
      },
      uiKind: {
        characterStage: {
          label: 'Character stage',
          description:
            'Displays only character images at a specified position and for a specified duration (for effects).',
        },
        commentBubble: {
          label: 'Speech bubble',
          description: 'Displays BOT comments as speech bubbles.',
        },
        gameRanking: {
          label: 'Game rankings',
          description: 'Displays results from games such as Suika Game in a ranking board.',
        },
        cookieCounter: {
          label: 'Cookie counter',
          description: 'Displays stream counts in a cookie-themed counter.',
        },
        kujibikiPanel: {
          label: 'Lottery panel',
          description: 'Displays omikuji and fortune-telling results in a panel.',
        },
        lifeHourglass: {
          label: 'Life hourglass',
          description: 'Stores watch time and gifts as grains of sand in bowls (experimental).',
        },
        liveClock: {
          label: 'Live clock',
          description: 'Displays a clock and messages.',
        },
        streamCounter: {
          label: 'Stream counter',
          description: 'Displays metrics such as concurrent viewers and likes.',
        },
        toastWidgets: {
          label: 'Toast notifications',
          description: 'Displays notification messages as toast notifications.',
        },
        userBoard: {
          label: 'User board',
          description: 'Displays user scores and teams in score lists, team bars, and leaderboards.',
        },
      },
    },
  },
} as const
