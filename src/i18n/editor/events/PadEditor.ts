// src/i18n/editor/events/PadEditor.ts
export const padEditorMessages = {
  ja: {
    padEditor: {
      notice: '「ポン出しイベント」は、LiveConsole のポン出しボタンが押されたときに発動します。サーバー(わんコメプラグイン)が必要です。',
    },
    padTrigger: {
      padLabel: 'ボタン',
      padDescription: '反応するポン出しボタンを選んでください(LiveConsole のボタン構成が 4個の場合は 1〜4 が使えます)',
      padName: 'ボタン {n}',
      preview: 'ボタン',
    },
  },
  en: {
    padEditor: {
      notice:
        'A "Pad Event" fires when a pad button is pressed in LiveConsole. It requires the server (OneComme plugin).',
    },
    padTrigger: {
      padLabel: 'Pad button',
      padDescription: 'Choose the pad button to react to (with the 4-pad layout in LiveConsole, 1–4 are available)',
      padName: 'Pad {n}',
      preview: 'Pad',
    },
  },
} as const
