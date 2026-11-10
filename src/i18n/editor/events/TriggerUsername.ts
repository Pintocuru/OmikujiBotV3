// src/i18n/editor/events/TriggerUsername.ts
export const triggerUsernameMessages = {
  ja: {
    triggerUsername: {
      label: '適用するユーザー名',
      description: '先頭に「!」を付けると除外。複数指定は改行で区切る',
      placeholder: `例:
!管理者名
!テストユーザー`,
      hints: {
        regex: '• 正規表現でユーザー名を照合',
        normal: '• 通常指定：一致したユーザー名が対象',
        negative: '• 除外指定（!付き）：一致したユーザー名を対象外にする',
      },
    },
  },
  en: {
    triggerUsername: {
      label: 'Applicable Usernames',
      description: 'Use "!" at the beginning for exclusion. Specify multiple by line break.',
      placeholder: `Example:
!admin_name
!test_user`,
      hints: {
        regex: '• Matches usernames using regular expressions',
        normal: '• Normal: Matched usernames become the condition target',
        negative: '• Negative (with !): Excludes matched usernames from the condition',
      },
    },
  },
} as const
