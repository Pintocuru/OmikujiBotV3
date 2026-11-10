// src/i18n/editor/events/CommentTriggerEditor.ts
export const commentTriggerMessages = {
  ja: {
    commentTrigger: {
      information: {
        descriptionBody: 'ギフトやチャット数などを基にイベントの発動を制御',
        note: '複数の条件がある場合、すべて満たすと発動（ANDのみ対応）',
      },
      setting: {
        label: '適用する発動条件',
        description: 'トリガーの種類',
      },
      noParams: {
        message: 'すべてのコメントで適用されます',
      },
      conditions: {
        comment: {
          label: 'チャットワード',
          description: 'チャット内のキーワードで判定',
        },
        syoken: {
          label: '初見判定ちゃん',
          description: '初見ユーザーと配信中の初回コメントを判定',
        },
        access: {
          label: 'ユーザーの役職',
          description: '配信者・モデレーターなどを判定',
        },
        gift: {
          label: 'ギフト',
          description: 'ギフトの種類や金額で判定',
        },
        count: {
          label: 'チャット数',
          description: '配信枠・ユーザーごとのコメント数で判定',
        },
        service: {
          label: '配信プラットフォーム',
          description: '配信サイトで判定',
        },
        userId: {
          label: 'ユーザーID',
          description: '指定したユーザーIDで判定',
        },
        username: {
          label: 'ユーザー名',
          description: '指定したユーザー名で判定',
        },
        timeRange: {
          label: '時間帯',
          description: '指定した時間帯で判定',
        },
        expression: {
          label: '判定式',
          description: '式の評価結果で判定',
        },
      },
    },
  },
  en: {
    commentTrigger: {
      information: {
        badge: 'Trigger Conditions',
        descriptionBody: ' controls event activation based on user gifts, chat counts, etc.',
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
        expression: {
          label: 'Expression',
          description: 'Judge by the result of an expression',
        },
      },
    },
  },
} as const
