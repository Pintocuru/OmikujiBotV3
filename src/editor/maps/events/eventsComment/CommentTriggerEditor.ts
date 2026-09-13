// src/editor/maps/events/CommentTriggerEditor.ts
export const commentTriggerMessages = {
  ja: {
    commentTrigger: {
      info: {
        badge: '発動条件設定',
        descriptionSuffix: 'では、ユーザーのギフト有無やチャット数などを基にイベント発動を制御します。',
        note: '条件が複数ある場合は、すべて満たしたときのみ発動します。(ANDのみ対応)',
      },
      setting: {
        label: '適用する発動条件',
        description: 'トリガーの種類を選択',
      },
      noParams: {
        message: 'すべてのコメントで適用されます',
      },
      // ▼ ここに旧 triggerConditionMap の内容を統合
      conditions: {
        comment: {
          label: 'チャットワード',
          description: 'チャットに含まれるキーワードで判定します',
        },
        syoken: {
          label: '初見判定ちゃん',
          description: '初見ユーザー、配信の1回目コメントを判定します',
        },
        access: {
          label: 'ユーザーの役職',
          description: '配信者・モデレーター等を判定します',
        },
        gift: {
          label: 'ギフト',
          description: 'ギフトの種類や金額で判定します',
        },
        count: {
          label: 'チャット数',
          description: '配信枠や個人ごとのコメント数で判定します',
        },
        service: {
          label: '配信プラットフォーム',
          description: '配信サイトで判定します',
        },
        userId: {
          label: 'ユーザーID',
          description: '特定のユーザーIDで判定します',
        },
        username: {
          label: 'ユーザー名',
          description: '特定のユーザー名で判定します',
        },
        timeRange: {
          label: '時間帯',
          description: '特定の時間帯で判定します',
        },
      },
    },
  },
  en: {
    commentTrigger: {
      info: {
        badge: 'Trigger Conditions',
        descriptionSuffix: ' controls event activation based on user gifts, chat counts, etc.',
        note: 'If there are multiple conditions, they must all be met to trigger. (AND only)',
      },
      setting: {
        label: 'Applicable Trigger Conditions',
        description: 'Select the type of trigger',
      },
      noParams: {
        message: 'Applied to all comments',
      },
      // ▼ 英語対応
      conditions: {
        comment: {
          label: 'Chat Words',
          description: 'Judge by keywords contained in the chat',
        },
        syoken: {
          label: 'First-time Check',
          description: 'Judge first-time users and 1st comments of the stream',
        },
        access: {
          label: 'User Roles',
          description: 'Judge broadcaster, moderators, etc.',
        },
        gift: {
          label: 'Gift',
          description: 'Judge by gift type or amount',
        },
        count: {
          label: 'Chat Count',
          description: 'Judge by comment count per stream or individual',
        },
        service: {
          label: 'Streaming Platform',
          description: 'Judge by streaming site',
        },
        userId: {
          label: 'User ID',
          description: 'Judge by specific user ID',
        },
        username: {
          label: 'Username',
          description: 'Judge by specific username',
        },
        timeRange: {
          label: 'Time Range',
          description: 'Judge by specific time range',
        },
      },
    },
  },
} as const
