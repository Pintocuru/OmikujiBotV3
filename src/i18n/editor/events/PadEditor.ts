// src/i18n/editor/events/PadEditor.ts
export const padEditorMessages = {
  ja: {
    padEditor: {
      notice:
        '「ポン出しイベント」は、LiveConsole のポン出しボタンが押されたときに発動します。おみくじBOTプラグインが必要です。',
    },
    padTrigger: {
      padLabel: 'ボタン',
      padDescription: '反応するポン出しボタンを選択',
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
      padDescription: 'Choose the pad button to react to',
      padName: 'Pad {n}',
      preview: 'Pad',
    },
  },
} as const
