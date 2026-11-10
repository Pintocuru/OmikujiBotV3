// src/i18n/editor/maps/EngineMapMessages.ts
export const engineMapMessages = {
  ja: {
    mapText: {
      defaultPlaceholder: {
        viewer: { label: '現在の枠の視聴ユーザー数', short: '【同時接続数】' },
        upVote: { label: '現在の枠の高評価数', short: '【高評価数】' },
        follower: { label: 'チャンネルの登録者数', short: '【登録数】' },
        lc: { label: '配信枠のコメント数', short: '【配信コメント数】' },
        tc: { label: '個人コメント数(総数)', short: '【個人総コメント数】' },
        commenter: { label: 'コメントをしたユーザー数', short: '【コメント数】' },
        syoken: { label: '初見さんの数', short: '【初見数】' },
        user: { label: 'コメントしたユーザー', short: '【ユーザー名】' },
        userId: { label: 'コメントしたユーザーID', short: '【ユーザーID】' },
        price: { label: 'ギフト金額', short: '【ギフト金額】' },
        giftCount: { label: 'ギフトの個数', short: '【メンバーギフト数】' },
      },
    },
  },
  en: {
    mapText: {
      defaultPlaceholder: {
        viewer: { label: 'Current stream viewers', short: '[Viewers]' },
        upVote: { label: 'Current stream likes', short: '[Likes]' },
        follower: { label: 'Channel subscribers', short: '[Subscribers]' },
        lc: { label: 'Comments in this stream', short: '[Stream comments]' },
        tc: { label: 'Total comments by this user', short: '[User comments]' },
        commenter: { label: 'Number of users who commented', short: '[Commenters]' },
        syoken: { label: 'Number of first-time visitors', short: '[First-time visitors]' },
        user: { label: 'Commenting user', short: '[Username]' },
        userId: { label: 'Commenting user ID', short: '[User ID]' },
        price: { label: 'Gift amount', short: '[Gift amount]' },
        giftCount: { label: 'Number of gifted memberships', short: '[Gifted memberships]' },
      },
    },
  },
} as const
