// src/i18n/editor/assets/OmikujiItemMessages.ts
// OmikujiItem* の labelKey / descriptionKey 用

export const omikujiItemMessages = {
  ja: {
    omikujiItem: {
      list: {
        testTooltip: 'わんコメを起動すると、投稿の確認ができます',
        test: '抽選テスト',
        add: 'おみくじを追加',
        columns: 'おみくじ / シナリオ / クールダウン',
      },
      summary: {
        unnamed: 'アイテム',
        editNameDescription: '名前・説明を編集',
        criteriaBadge: '条件',
      },
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
        enable: '設定する',
        priorityEnabledMessage: '適用時、このおみくじが必ず適用されます',
        priorityDisabledMessage: '他のおみくじと同じ抽選を行います',
      },
      scenario: {
        label: '実行するシナリオ',
        description: 'このおみくじが当たったとき、実行されます(1つのおみくじに1つ)',
        none: 'シナリオが選ばれていません…',
        noneShort: 'シナリオ未選択',
        missing: '「{key}」は存在しません',
        missingShort: 'シナリオが見つかりません',
        pick: 'シナリオを選ぶ',
        change: '変更',
        edit: 'シナリオを編集',
        unlink: '接続を解除',
        create: '新しいシナリオを作成する',
        shared: '他に {count} 件のおみくじでも使用',
        controlNote: 'このおみくじはシナリオを実行せず、処理の流れを制御します。',
        controlShort: '制御',
        dialog: {
          title: 'シナリオを選択',
          search: '名前・説明・Key で絞り込み',
          keyLabel: 'キー',
          empty: '該当するシナリオがありません…',
          noDescription: '説明はありません',
          steps: 'ステップ {count}件',
          select: '選択',
          close: '閉じる',
        },
      },
      header: {
        name: {
          label: '運勢の種類',
          description: '識別しやすい名前を入力',
        },
        cooldown: {
          label: 'クールダウン',
          description: 'これ以降の実行を一定時間ブロックします（秒）',
          inputTitle: 'クールダウン(秒)',
          unit: '秒',
        },
      },
      dialogs: {
        baseTitle: '名前・説明',
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
        help: {
          conditionName: '追加発動条件',
          conditionDescription: 'は、コメント内容やチャット数などを基にイベント発動を制御します。',
          allRequired: '条件が複数ある場合は、すべて満たしたときのみ発動します。',
          adminCommands: '管理者限定コマンドなどの応用も可能です。',
          empty: '発動条件が指定されていません',
        },
      },
    },
  },
  en: {
    omikujiItem: {
      list: {
        testTooltip: 'Start OneComme to preview the post',
        test: 'Test draw',
        add: 'Add omikuji',
        columns: 'Omikuji / Scenario / Cooldown',
      },
      summary: {
        unnamed: 'Item',
        editNameDescription: 'Edit name and description',
        criteriaBadge: 'Condition',
      },
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
        enable: 'Enable',
        priorityEnabledMessage: 'This omikuji is guaranteed to be selected when its conditions are met',
        priorityDisabledMessage: 'Draw this omikuji like any other',
      },
      scenario: {
        label: 'Scenario to run',
        description: 'Runs when this omikuji is drawn (one scenario per omikuji)',
        none: 'No scenario selected…',
        noneShort: 'No scenario',
        missing: '"{key}" does not exist',
        missingShort: 'Scenario not found',
        pick: 'Choose a scenario',
        change: 'Change',
        edit: 'Edit scenario',
        unlink: 'Disconnect',
        create: 'Create a new scenario',
        shared: 'Also used by {count} other omikuji',
        controlNote: 'This omikuji does not run a scenario; it controls the flow.',
        controlShort: 'Control',
        dialog: {
          title: 'Select a scenario',
          search: 'Filter by name, description or key',
          keyLabel: 'Key',
          empty: 'No matching scenarios…',
          noDescription: 'No description',
          steps: '{count} step(s)',
          select: 'Select',
          close: 'Close',
        },
      },
      header: {
        name: {
          label: 'Fortune type',
          description: 'Enter an easy-to-identify name',
        },
        cooldown: {
          label: 'Cooldown',
          description: 'Blocks further execution for a set time (seconds)',
          inputTitle: 'Cooldown (seconds)',
          unit: 's',
        },
      },
      dialogs: {
        baseTitle: 'Name and description',
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
        help: {
          conditionName: 'Additional trigger conditions',
          conditionDescription: ' let you control event triggers based on comment content, chat count, and similar criteria.',
          allRequired: 'If multiple conditions are set, all of them must be met for the event to trigger.',
          adminCommands: 'You can also configure advanced options, such as commands limited to administrators.',
          empty: 'No trigger conditions have been specified',
        },
      },
    },
  },
} as const
