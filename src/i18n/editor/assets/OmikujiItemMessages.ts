// src/i18n/editor/assets/OmikujiItemMessages.ts
// OmikujiItem* の labelKey / descriptionKey 用

export const omikujiItemMessages = {
  ja: {
    omikujiItem: {
      priority: {
        criteria: {
          label: '追加発動条件',
          description: '条件を満たした場合の優先度を設定できます',
        },
        priority: {
          label: '優先度',
          description: '追加条件達成時、優先で選ばれます',
        },
        sectionTitle: '追加条件',
        sectionDescription: 'このおみくじが適用される追加の条件を設定します',
      },
      header: {
        name: {
          label: '運勢の種類',
          description: '識別しやすい名前を入力',
        },
        cooldown: {
          label: 'クールダウン',
          description: 'これ以降の実行を一定時間ブロックします（秒）',
        },
      },
      editor: {
        kind: {
          label: '実行内容',
          description: 'このおみくじの処理内容を選択します',
        },
        command: {
          label: '制御の種類',
          description: '処理の流れをどう制御するかを選択します',
        },
      },
      control: {
        label: '評価ブロック',
        description: 'この制御を実行するときに評価されます',
      },
      criteria: {
        label: '適用する発動条件',
        description: 'トリガーの種類を選択',
      },
    },
  },
  en: {
    omikujiItem: {
      priority: {
        criteria: {
          label: 'Additional conditions',
          description: 'Set the priority used when the conditions are met',
        },
        priority: {
          label: 'Priority',
          description: 'Chosen first when the additional conditions are met',
        },
        sectionTitle: 'Additional conditions',
        sectionDescription: 'Set additional conditions under which this omikuji applies',
      },
      header: {
        name: {
          label: 'Fortune type',
          description: 'Enter an easy-to-identify name',
        },
        cooldown: {
          label: 'Cooldown',
          description: 'Blocks further execution for a set time (seconds)',
        },
      },
      editor: {
        kind: {
          label: 'Action',
          description: 'Choose what this omikuji does',
        },
        command: {
          label: 'Control type',
          description: 'Choose how the flow of processing is controlled',
        },
      },
      control: {
        label: 'Evaluation block',
        description: 'Evaluated when this control is executed',
      },
      criteria: {
        label: 'Conditions to apply',
        description: 'Choose the trigger types',
      },
    },
  },
} as const
