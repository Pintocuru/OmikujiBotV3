// src/i18n/editor/events/TriggerExpression.ts
export const triggerExpressionMessages = {
  ja: {
    triggerExpression: {
      label: '判定式',
      description: '式が true になったときだけ発動します。',
      hints: {
        variable: '• プレースホルダーはデフォルトのみ使用できます (lc, tc, user, price, viewer など)',
        operator: '• 比較 (> >= < <= == !=) と論理 (and, or, not) が使えます',
        userVariable: '• 評価ブロックも参照できます',
        example: '例:',
      },
    },
  },
  en: {
    triggerExpression: {
      label: 'Expression',
      description: 'Triggers only when the expression evaluates to true.',
      // TODO:hints の翻訳をなおすこと。
      hints: {
        variable:
          '• Wrap a variable name in double angle brackets to use its value (lc, tc, user, price, viewer, etc.)',
        operator: '• Comparison (> >= < <= == !=) and logic (and, or, not) are available',
        userVariable: '• Variables created by omikuji expressions can also be read (read-only)',
        example: 'Example:',
      },
    },
  },
} as const
