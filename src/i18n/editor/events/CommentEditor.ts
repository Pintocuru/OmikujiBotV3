// src/i18n/editor/events/CommentEditor.ts
export const commentEditorMessages = {
  ja: {
    commentEditor: {
      omikujiKeyMissing: '存在しないみくじ箱を指定しているようです。設定を確認してください。',
      omikujiKeyUnselected: 'みくじ箱を選択してください。',
      disabledNotice: {
        title: '現在、このイベントは無効になっています。',
        action: '編集を行うには、まずイベントを有効にしてください。',
      },
    },
  },
  en: {
    commentEditor: {
      omikujiKeyMissing: 'The specified omikuji box does not seem to exist. Please check your settings.',
      omikujiKeyUnselected: 'Please select an omikuji box.',
      disabledNotice: {
        title: 'This event is currently disabled.',
        action: 'Please enable the event first before editing.',
      },
    },
  },
} as const
