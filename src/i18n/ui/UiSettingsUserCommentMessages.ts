// src/i18n/editor/ui/UiSettingsUserCommentMessages.ts
// UI 設定の翻訳: userComment
export const uiSettingsUserComment = {
  ja: {
    uiSettings: {
      userComment: {
        nameMode: {
          label: '名前の表示',
          description: 'ユーザー名をそのまま出すか、名無しさん+ID(同じユーザーは同じ ID)にするか',
          options: {
            userName: 'ユーザー名',
            anonymous: '名無しさん+ID',
          },
        },
        maxItems: {
          label: '表示件数',
          description: '新しいコメントから、この件数まで表示(最大30)',
        },
      },
    },
  },
  en: {
    uiSettings: {
      userComment: {
        nameMode: {
          label: 'Name display',
          description:
            'Show the user name as is, or an anonymous name with an ID (the same user always gets the same ID)',
          options: {
            userName: 'User name',
            anonymous: 'Anonymous + ID',
          },
        },
        maxItems: {
          label: 'Items shown',
          description: 'Shows up to this many of the newest comments (max 30)',
        },
      },
    },
  },
}
