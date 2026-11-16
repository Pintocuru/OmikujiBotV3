// src/i18n/ui/UiSettingsDeadAirMessages.ts
// UI 設定の翻訳: deadAir
export const uiSettingsDeadAir = {
  ja: {
    uiSettings: {
      deadAir: {
        obstacle: {
          label: '背景色',
          description: '画面の背景色です',
          black: '黒',
          white: '白',
        },
        initialMinutes: {
          label: '残り時間(分)',
          description: '時間が0になるとライフが1減り、残り時間が元に戻ります',
        },
        initialLives: {
          label: 'ライフ',
          description: 'ライフが0になるとゲームオーバーです',
        },
        bonus: {
          label: 'ボーナス',
          description: '上限を超えて回復した時間を貯め、満タンでライフを1回復します',
        },
        optionalCounter: {
          label: '表示するカウンター',
          description: '爆弾に表示するカウンターのキーです(空欄で非表示)',
        },
        eventRules: {
          label: '回復ルール',
          description: 'カウンターが増えたときの回復を決めます',
          every: 'が',
          then: '増えるごとに',
          timer: '時間(分)を延ばす',
          life: 'ライフを回復',
          add: 'ルールを追加',
          remove: 'ルールを削除',
        },
        preview: {
          speed: '速度',
          counter: 'カウンター',
          restart: '最初から',
        },
      },
    },
  },
  en: {
    uiSettings: {
      deadAir: {
        obstacle: {
          label: 'Background color',
          description: 'Background color of the screen',
          black: 'Black',
          white: 'White',
        },
        initialMinutes: {
          label: 'Time (minutes)',
          description: 'When the time reaches 0, you lose one life and the time is reset',
        },
        initialLives: {
          label: 'Lives',
          description: 'The game is over when lives reach 0',
        },
        bonus: {
          label: 'Bonus',
          description: 'Time restored beyond the limit is saved up, and a full gauge restores one life',
        },
        optionalCounter: {
          label: 'Displayed counter',
          description: 'Key of a counter shown on the bomb (leave empty to hide)',
        },
        eventRules: {
          label: 'Recovery rules',
          description: 'Decide what is restored when a counter increases',
          every: 'every',
          then: 'increase:',
          timer: 'add minutes',
          life: 'restore lives',
          add: 'Add rule',
          remove: 'Remove rule',
        },
        preview: {
          speed: 'Speed',
          counter: 'Counter',
          restart: 'Restart',
        },
      },
    },
  },
} as const
