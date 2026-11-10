// src/i18n/editor/category/CategorySectionMessagesMap.ts
export const categorySectionMessages = {
  ja: {
    categorySections: {
      baseSettings: { label: '基本設定', description: 'データの名前や説明などを設定' }, 
      trigger: { label: 'トリガー設定', description: 'おみくじを引くきっかけを設定' },
      mikuji: { label: 'みくじ箱設定', description: 'おみくじの抽選方法と確率を設定' },
      scenarios: {
        label: 'シナリオ編集',
        description: 'シナリオ（演出セット）の順番とステップ（演出内容）を設定',
      },
      timerInterval: { label: 'タイマー設定', description: '発動間隔とタイミングを設定' },
      placeholder: { label: 'プレースホルダー設定', description: '抽選するプレースホルダーを設定' },
      characterStyle: { label: 'カラー・投稿設定', description: 'フキダシの色とBOTコメントの表現を設定' },
      imageSettings: { label: 'キャラクター画像設定', description: 'ジェネレーターに表示する画像を設定' },
    },
  },
  en: {
    categorySections: {
      baseSettings: { label: 'Basic Settings', description: 'Basic settings' },
      trigger: { label: 'Trigger Conditions', description: 'Set trigger conditions for drawing omikuji' },
      mikuji: { label: 'Action Settings', description: 'Omikuji lottery settings and contents' },
      scenarios: {
        label: 'Edit Scenarios',
        description: 'Edit the trigger order of scenarios (effect sets) and their steps (effect contents).',
      },
      timerInterval: { label: 'Timer Settings', description: 'Set interval and timing for triggering' },
      placeholder: { label: 'Placeholder Settings', description: 'Edit placeholders to draw from' },
      characterStyle: {
        label: 'Display Settings',
        description: 'Set speech bubble colors and how BOT comments are expressed',
      },
      colorSettings: { label: 'Character Color Settings', description: 'Edit speech bubble colors' },
      commentVoice: { label: 'BOT Comment Voice Settings', description: 'Specify how BOT comments are read aloud' },
      imageSettings: { label: 'Generator Image Settings', description: 'Set images displayed in the generator' },
      commonStyle: { label: 'Common Settings', description: 'Settings shared by all displays, such as fonts' },
      commentBubble: { label: 'Speech Bubble', description: 'Displays BOT comments as speech bubbles.' },
      appSettings: { label: 'App Settings', description: '' },
      appFeatures: { label: 'Available Features', description: '' },
      packageBasic: { label: 'Basic Info', description: '' },
      packageDistribution: { label: 'Distribution Info', description: '' },
      packageSystem: { label: 'System Info', description: '' },
    },
  },
} as const
