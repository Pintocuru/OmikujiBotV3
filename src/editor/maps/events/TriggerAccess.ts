// src/editor/maps/events/TriggerAccess.ts
export const triggerAccessMessages = {
  ja: {
    triggerAccess: {
      label: 'ユーザーの役職',
      description: 'メンバー限定の発動条件はここです!',
      // バッジなどの選択肢の文言もここに統合する
      conditions: {
        basic: {
          label: '一般ユーザー',
          description: '以下どれにも該当しないユーザー',
        },
        member: {
          label: '有料メンバー',
          description: 'Youtube等のメンバーシップ',
        },
        moderator: {
          label: 'モデレーター',
          description: 'モデレーターの権限を持つユーザー',
        },
        owner: {
          label: '配信者',
          description: '配信者本人',
        },
        anonymous: {
          label: '匿名ユーザー',
          description: '匿名ユーザー',
        },
      },
    },
  },
  en: {
    triggerAccess: {
      label: 'User Roles',
      description: 'Trigger conditions limited to members are here!',
      conditions: {
        basic: {
          label: 'Basic User',
          description: 'Users who do not fall under any of the following',
        },
        member: {
          label: 'Paid Member',
          description: 'YouTube or other memberships',
        },
        moderator: {
          label: 'Moderator',
          description: 'Users with moderator privileges',
        },
        owner: {
          label: 'Broadcaster',
          description: 'The broadcaster themselves',
        },
        anonymous: {
          label: 'Anonymous',
          description: 'Anonymous users',
        },
      },
    },
  },
} as const
