// src/editor/maps/events/TriggerExpression.ts
export const triggerExpressionMessages = {
  ja: {
    triggerExpression: {
      label: '判定式',
      description: '式が true になったときだけ発動します。',
      hints: {
        variable: '• 変数名を二重山括弧で囲むと値を参照できます (lc, tc, user, price, viewer など)',
        string: '• 文字列は半角のシングルクォートで囲みます',
        operator: '• 比較 (> >= < <= == !=) と論理 (and, or, not) が使えます',
        userVariable: '• おみくじの式で作った変数も参照できます (読み取りのみ)',
        invalid: '• 式が正しくない、または評価できない場合は発動しません',
        example: '例:',
      },
    },
  },
  en: {
    triggerExpression: {
      label: 'Expression',
      description: 'Triggers only when the expression evaluates to true.',
      hints: {
        variable:
          '• Wrap a variable name in double angle brackets to use its value (lc, tc, user, price, viewer, etc.)',
        string: '• Enclose strings in single quotes',
        operator: '• Comparison (> >= < <= == !=) and logic (and, or, not) are available',
        userVariable: '• Variables created by omikuji expressions can also be read (read-only)',
        invalid: '• If the expression is invalid or cannot be evaluated, it will not trigger',
        example: 'Example:',
      },
    },
  },
} as const
