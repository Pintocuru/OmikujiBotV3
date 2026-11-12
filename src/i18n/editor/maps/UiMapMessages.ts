// src/i18n/editor/maps/UiMapMessages.ts
export const uiMapMessages = {
  ja: {
    mapText: {
      uiLayout: {
        commentBubble: {
          label: 'フキダシ',
          description: 'シンプルなフキダシでおみくじ結果を表示',
        },
        gameRanking: {
          label: 'ゲームランキング',
          description: 'ゲーム結果をランキング形式で表示',
        },
        sesupinTest: {
          label: 'せすぴん(管理者)用',
          description: 'すべてのUIを表示するレイアウト',
        },
        lifeHourglass: {
          label: '命の砂時計',
          description: 'リスナーが配信を閲覧した時間を「砂粒」として表示する、砂時計ジェネレーター',
        },
        kujibikiPanel: {
          label: 'くじ引きパネル',
          description: 'おみくじ・占いの結果をパネル形式で表示',
        },
      },
      uiKind: {
        characterStage: {
          label: 'キャラクターステージ',
          description: '演出用。キャラクター画像を指定位置・秒数で表示',
        },
        commentBubble: {
          label: 'フキダシ',
          description: 'BOTの発言を吹き出し形式で表示',
        },
        gameRanking: {
          label: 'ゲームランキング',
          description: 'スイカゲームなどの結果をランキング形式で表示',
        },
        cookieCounter: {
          label: 'クッキーカウンター',
          description: '配信の数値をクッキー風カウンターで表示',
        },
        kujibikiPanel: {
          label: 'くじ引きパネル',
          description: 'おみくじ・占いの結果をパネル形式で表示します。',
        },
        lifeHourglass: {
          label: '命の砂時計',
          description: '時間経過で数字が増えるカウントアップカウンター',
        },
        liveClock: {
          label: 'ライブクロック',
          description: '時計とメッセージを表示',
        },
        streamCounter: {
          label: '配信カウンター',
          description: '同時接続数や高評価数などを表示',
        },
        toastWidgets: {
          label: 'トースト',
          description: '通知メッセージをトースト形式で表示',
        },
        userBoard: {
          label: 'ユーザーボード',
          description: 'ユーザーの得点・チームをリストやスコアボードで表示',
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
        kujibikiPanel: {
          label: 'Lottery panel',
          description: 'Displays omikuji and fortune-telling results in a panel.',
        },
        lifeHourglass: {
          label: 'Life hourglass',
          description:
            'An hourglass generator that shows the time listeners spend watching your stream as grains of sand.',
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
          description: 'A count-up counter whose number increases as time passes.',
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
