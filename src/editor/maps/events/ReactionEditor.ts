// src/editor/maps/events/ReactionEditor.ts
export const reactionEditorMessages = {
  ja: {
    reactionEditor: {
      platformNotice: '「リアクションイベント」は、Youtube の リアクションのみ対応しています。',
      disabledNotice: {
        title: '現在、このイベントは無効になっています。',
        action: '編集を行うには、まずイベントを有効にしてください。',
      },
    },
  },
  en: {
    reactionEditor: {
      platformNotice: 'The "Reaction Event" only supports YouTube reactions.',
      disabledNotice: {
        title: 'This event is currently disabled.',
        action: 'Please enable the event first before editing.',
      },
    },
  },
} as const
