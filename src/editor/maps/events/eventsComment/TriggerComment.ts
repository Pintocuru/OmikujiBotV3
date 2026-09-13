// src/editor/maps/events/TriggerComment.ts
export const triggerCommentMessages = {
  ja: {
    triggerComment: {
      label: '適用するチャットワード',
      description: '正規表現対応。改行で複数指定できます',
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
