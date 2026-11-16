// src/i18n/editor/ui/UiSettingsLabelMakerMessages.ts
// UI 設定の翻訳: labelMaker
export const uiSettingsLabelMaker = {
  ja: {
    uiSettings: {
      labelMaker: {
        component: {
          label: '表示のしかた',
          description: 'ユーザーリスト(バッジ)・ユーザーカード(スクロール)から選択',
        },
        target: {
          label: 'ユーザーの数え方',
          description: '同じユーザーを何度も載せるか(プレビューで確認できます)',
          options: {
            user: 'ユーザーごと(重複なし)',
            draw: '投稿ごと(重複あり)',
          },
        },
        color: {
          label: 'カラー設定',
          description: '背景・名前・バッジの色',
        },
        limit: {
          label: '表示件数',
          description: '新しいユーザーから、この人数まで表示(最大100)',
        },
      },
    },
  },
  en: {
    uiSettings: {
      labelMaker: {
        component: {
          label: 'Display mode',
          description: 'Choose between the user list (badges) and the user cards (scrolling)',
        },
        target: {
          label: 'How users are counted',
          description: 'Whether the same user can appear more than once (check it in the preview)',
          options: {
            user: 'Per user (no duplicates)',
            draw: 'Per post (duplicates allowed)',
          },
        },
        color: {
          label: 'Color',
          description: 'Colors of the background, names and badges',
        },
        limit: {
          label: 'Number of entries',
          description: 'Show up to this many users, newest first (max 100)',
        },
      },
    },
  },
} as const
