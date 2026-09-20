// src/editor/maps/events/EventCore.ts
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
      disabledNotice: {
        title: '現在、このイベントは無効になっています。',
        action: '編集を行うには、まずイベントを有効にしてください。',
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
      disabledNotice: {
        title: 'This event is currently disabled.',
        action: 'Please enable the event first before editing.',
      },
    },
  },
} as const
