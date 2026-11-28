export const uiSettingsDisplay = {
  ja: {
    uiSettings: {
      commentBubble: {
        persistentCharacter: {
          label: '常時表示キャラクター',
          description: '未設定ならコメント受信時のみ表示',
          none: 'なし',
        },
        characterSize: {
          label: 'キャラクターの大きさ',
          description: 'キャラクター画像の横幅',
          current: '現在値: {size}px',
        },
        preview: {
          replay: '再表示',
          userName: 'テストユーザー',
          sample1: 'これはプレビュー表示です。',
          sample2: '実際の表示タイプと同じ配置で確認できます。',
        },
      },
    },
  },
  en: {
    uiSettings: {
      commentBubble: {
        persistentCharacter: {
          label: 'Always-visible character',
          description: 'If not set, the character appears only when a comment arrives',
          none: 'None',
        },
        characterSize: {
          label: 'Character size',
          description: 'Adjust the width of the character image',
          current: 'Current: {size}px',
        },
        preview: {
          replay: 'Replay',
          userName: 'Test user',
          sample1: 'This is a preview.',
          sample2: 'You can check it with the same layout as the actual display type.',
        },
      },
    },
  },
} as const
