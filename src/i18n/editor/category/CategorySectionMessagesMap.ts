// src/i18n/editor/category/CategorySectionMessagesMap.ts
export const categorySectionMessages = {
  ja: {
    categorySections: {
      baseSettings: { label: '基本設定', description: '基本設定' }, // TODO 説明文をどうするか
      trigger: { label: 'トリガー設定', description: 'おみくじを引く、トリガー(きっかけ)の設定' },
      mikuji: { label: 'みくじ箱設定', description: 'おみくじの抽選方法や確率を編集します' },
      scenarios: {
        label: 'シナリオ編集',
        description: 'シナリオ(演出セット)の発動順や、ステップ(演出内容)を編集します',
      },
      timerInterval: { label: 'タイマー設定', description: '発動する間隔やタイミングの設定' },
      placeholder: { label: 'プレースホルダー設定', description: '抽選するプレースホルダーを編集します' },
      characterStyle: { label: 'カラー・投稿設定', description: 'フキダシの色と、BOTコメントの表現を設定します' },
      imageSettings: { label: 'キャラクター画像設定', description: 'ジェネレーターで表示する画像の設定' },
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
