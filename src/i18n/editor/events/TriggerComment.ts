// src/i18n/editor/events/TriggerComment.ts
export const triggerCommentMessages = {
  ja: {
    triggerComment: {
      label: '適用するチャットワード',
      description: '正規表現に対応。複数指定は改行で区切る',
      placeholder: `例:
^こんにちは|おはよう$
テスト.*
^ありがとう`,
    },
  },
  en: {
    triggerComment: {
      label: 'Applicable Chat Words',
      description: 'Supports regular expressions. Specify multiple by line break.',
      placeholder: `Example:
^hello|good morning$
test.*
^thanks`,
    },
  },
} as const
