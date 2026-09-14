// src/editor/maps/events/TriggerUsername.ts
export const triggerUsernameMessages = {
  ja: {
    triggerUsername: {
      label: '適用するユーザー名',
      description: '先頭に「!」で除外指定します。改行で複数指定。',
      placeholder: `例:
!管理者名
!テストユーザー`,
      hints: {
        regex: '• 正規表現でユーザー名をマッチングします',
        normal: '• 通常の指定: マッチしたユーザー名が条件対象となります',
        negative: '• ネガティブ指定(!付き): マッチしたユーザー名を条件から除外します',
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
