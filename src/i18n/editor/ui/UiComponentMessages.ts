// src/i18n/editor/ui/UiComponentMessages.ts
// UI 内コンポーネントの表示名 (register.ts の labelKey / descriptionKey 用)
// キー: uiComponents.<UI名>.<コンポーネントID>.label / .description

export const uiComponentMessages = {
  ja: {
    uiComponents: {
      commentBubble: {
        standard: {
          label: 'スタンダード',
        },
        left: {
          label: 'レフト(キャラ左・吹き出し右)',
        },
        right: {
          label: 'ライト(キャラ右・吹き出し左)',
        },
        woodBoard: {
          label: 'メッセージボード(木の看板)',
        },
        chalkBoard: {
          label: 'メッセージボード(黒板)',
        },
        rpgWindow: {
          label: 'メッセージボード(RPGウィンドウ)',
        },
      },
      cookieCounter: {
        sakura: {
          label: 'さくらツイン🌸',
        },
        block3d: {
          label: 'ブロックツイン',
        },
      },
      gameRanking: {
        standard: {
          label: 'スタンダード',
        },
        suikaGame: {
          label: 'スイカゲーム風ランキング',
        },
      },
      kujibikiPanel: {
        tarot: {
          label: 'タロット',
        },
        bigBang: {
          label: 'ビッグバン',
        },
        faceCutout: {
          label: '顔ハメ看板',
        },
        omikuji: {
          label: 'おみくじ',
        },
        flower: {
          label: 'フラワー占い',
        },
      },
      lifeHourglass: {
        sandBowl: {
          label: '砂の器',
        },
      },
      liveClock: {
        morning: {
          label: 'モーニング',
        },
        soundPlayer: {
          label: 'サウンドプレイヤー',
        },
        clearGlass: {
          label: 'クリアガラス',
        },
        steampunk: {
          label: 'スチーム',
        },
        disco: {
          label: 'ディスコ',
        },
      },
      streamCounter: {
        pixelBadge: {
          label: 'ピクセルバッジ',
        },
      },
      toastWidgets: {
        standard: {
          label: 'スタンダード(チャット風)',
        },
        simple: {
          label: 'シンプル(角丸ラベル)',
        },
        card: {
          label: 'カード(アクセントライン付き)',
        },
      },
      userBoard: {
        ranking: {
          label: '個人の得点リスト',
          description: '得点の高い順に、ユーザーを表示します',
        },
        teamBar: {
          label: 'チームの得点(バー)',
          description: 'チーム色ごとの合計得点を、バーの長さで比べられるように表示します',
        },
        teamScore: {
          label: 'チームの得点(スコアボード)',
          description: 'チーム色ごとの合計得点を、大きな数字で横に並べて表示します',
        },
      },
    },
  },
  en: {
    uiComponents: {
      commentBubble: {
        standard: {
          label: 'Standard',
        },
        left: {
          label: 'Left (character on the left, bubble on the right)',
        },
        right: {
          label: 'Right (character on the right, bubble on the left)',
        },
        woodBoard: {
          label: 'Message board (wooden sign)',
        },
        chalkBoard: {
          label: 'Message board (chalkboard)',
        },
        rpgWindow: {
          label: 'Message board (RPG window)',
        },
      },
      cookieCounter: {
        sakura: {
          label: 'Sakura twin🌸',
        },
        block3d: {
          label: 'Block twin',
        },
      },
      gameRanking: {
        standard: {
          label: 'Standard',
        },
        suikaGame: {
          label: 'Suika Game-style ranking',
        },
      },
      kujibikiPanel: {
        tarot: {
          label: 'Tarot',
        },
        bigBang: {
          label: 'Big Bang',
        },
        faceCutout: {
          label: 'Face-in-hole board',
        },
        omikuji: {
          label: 'Omikuji (fortune slip)',
        },
        flower: {
          label: 'Flower fortune',
        },
      },
      lifeHourglass: {
        sandBowl: {
          label: 'Sand bowl',
        },
      },
      liveClock: {
        morning: {
          label: 'Morning',
        },
        soundPlayer: {
          label: 'Sound player',
        },
        clearGlass: {
          label: 'Clear glass',
        },
        steampunk: {
          label: 'Steampunk',
        },
        disco: {
          label: 'Disco',
        },
      },
      streamCounter: {
        pixelBadge: {
          label: 'Pixel badge',
        },
      },
      toastWidgets: {
        standard: {
          label: 'Standard (chat style)',
        },
        simple: {
          label: 'Simple (rounded label)',
        },
        card: {
          label: 'Card (with accent line)',
        },
      },
      userBoard: {
        ranking: {
          label: 'Individual score list',
          description: 'Shows users in descending order of score',
        },
        teamBar: {
          label: 'Team scores (bar)',
          description: 'Shows the total score of each team color as bars, so they can be compared by length',
        },
        teamScore: {
          label: 'Team scores (scoreboard)',
          description: 'Shows the total score of each team color as large numbers side by side',
        },
      },
    },
  },
} as const
