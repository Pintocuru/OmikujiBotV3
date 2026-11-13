// src/i18n/editor/ui/UiSettingsSnipeTimerMessages.ts
// UI 設定の翻訳: snipeTimer
export const uiSettingsSnipeTimer = {
  ja: {
    uiSettings: {
      snipeTimer: {
        previewHint: '左クリック: 開始・停止 / 右クリック: リセット',
        animation: {
          label: 'アニメーション',
          description: '表示・非表示のアニメーション',
        },
        initialSeconds: {
          label: '開始の秒数',
          description: 'クリックで開始したときのカウント秒数',
          unit: '秒',
        },
        secondAdjust: {
          label: '秒を丸める単位',
          description: 'クリックで開始したとき、目標時刻の秒をこの単位に切り上げます',
          option: '{seconds}秒',
        },
        alwaysVisible: {
          label: '常時表示',
          description: 'オフのときは、カウント中と終了後だけ表示します(クリックで操作するなら、オンにしてください)',
        },
        afterShowSeconds: {
          label: '終了後の表示秒数',
          description: 'カウントが 0 になってから、表示を続ける秒数',
        },
      },
    },
  },
  en: {
    uiSettings: {
      snipeTimer: {
        previewHint: 'Left-click: start / stop. Right-click: reset',
        animation: {
          label: 'Animation',
          description: 'Animation for showing and hiding the timer',
        },
        initialSeconds: {
          label: 'Start seconds',
          description: 'Countdown length when started by a click',
          unit: 'sec',
        },
        secondAdjust: {
          label: 'Round seconds to',
          description: 'When started by a click, the target time is rounded up to a multiple of this many seconds',
          option: '{seconds}s',
        },
        alwaysVisible: {
          label: 'Always visible',
          description:
            'When off, the timer is shown only while counting and after it ends (turn on to operate it by clicking)',
        },
        afterShowSeconds: {
          label: 'Seconds shown after end',
          description: 'How long the timer stays visible after it reaches 0',
        },
      },
    },
  },
} as const
