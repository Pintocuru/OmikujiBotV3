// src/i18n/editor/events/EventCore.ts
export const eventCoreMessages = {
  ja: {
    eventCore: {
      boxChoiceEditor: {
        omikujiKey: {
          label: 'みくじ箱',
          description: '使用するみくじ箱を選択してください。',
          none: '未選択',
        },
      },
      scenarioChoiceEditor: {
        stepKey: {
          label: 'シナリオ',
          description: '実行するシナリオを選択してください。',
          none: '未選択',
          missing: 'キー「{key}」は存在しません',
        },
      },
      disabledNotice: {
        title: '現在、このイベントは無効になっています。',
        action: '編集を行うには、まずイベントを有効にしてください(名前の横の鉛筆ボタンから切り替えられます)。',
      },
    },
  },
  en: {
    eventCore: {
      boxChoiceEditor: {
        omikujiKey: {
          label: 'Omikuji Box',
          description: 'Select which omikuji box to use.',
          none: 'None selected',
        },
      },
      scenarioChoiceEditor: {
        stepKey: {
          label: 'Scenario',
          description: 'Select which scenario to run.',
          none: 'None selected',
          missing: 'Key "{key}" does not exist',
        },
      },
      disabledNotice: {
        title: 'This event is currently disabled.',
        action: 'Please enable the event first before editing (use the pencil button next to the name).',
      },
    },
  },
} as const
