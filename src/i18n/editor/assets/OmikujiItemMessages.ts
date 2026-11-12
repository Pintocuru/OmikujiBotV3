// src/i18n/editor/assets/OmikujiItemMessages.ts
// OmikujiItem* の labelKey / descriptionKey 用

export const omikujiItemMessages = {
  ja: {
    omikujiItem: {
      cooldownHelp: {
        title: 'クールダウン(秒)について',
        summary:
          '実行後、指定秒数の間、これより小さい値のおみくじをブロックします。同じ値や大きい値はブロックしません。',
        basis: '判定基準は直前に実行された1件のみです。',
        zero: '0・未設定のおみくじは他をブロックしませんが、ブロック対象にはなります。',
        negative: '負の値も使用可能。-3なら3秒間、-4以下のおみくじをブロックします。',
        blocked: 'ブロックされた回は投稿せず、再実行もしません。',
        examplesTitle: '使い方の例',
        example1: '初見さんの挨拶を5に設定 → 5秒間、0の定期案内に上書きされない',
        example2: 'レアなおみくじを10に設定 → 10秒間、通常のおみくじが割り込めない（演出時間を確保）',
      },
      list: {
        testTooltip: 'わんコメ起動中に投稿を確認',
        test: '抽選テスト',
        add: 'おみくじを追加',
        columns: 'おみくじ / シナリオ / クールダウン',
        headerOmikuji: 'おみくじ',
      },
      summary: {
        unnamed: 'アイテム',
        editNameDescription: '名前・説明を編集',
        criteriaBadge: '条件',
      },
      priority: {
        criteria: {
          label: '追加発動条件',
          description: '条件を満たした場合の優先度',
        },
        priority: {
          label: '優先度',
          badge: '優先',
          description: '追加条件を満たすと優先的に選択',
        },
        sectionTitle: '追加条件',
        sectionDescription: 'このおみくじに適用する追加条件',
        enable: '設定する',
        priorityEnabledMessage: '条件を満たすと、このおみくじを適用',
        priorityDisabledMessage: '他のおみくじと同じ条件で抽選',
      },
      scenario: {
        label: 'シナリオ',
        description: 'このおみくじを引くと実行',
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
        controlNote: 'シナリオを実行せず、処理の流れを制御',
        controlShort: '制御',
        dialog: {
          title: 'シナリオを選択',
          search: '名前・説明・Key で絞り込み',
          keyLabel: 'キー',
          empty: '該当するシナリオがありません…',
          noDescription: '説明はありません',
          steps: 'ステップ {count}件',
          select: '選択',
        },
      },
      header: {
        name: {
          label: '運勢の種類',
          description: '識別しやすい名前',
        },
        cooldown: {
          label: 'クールダウン',
          description: '実行後、この秒数の間、これより小さい値のおみくじをブロック',
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
          description: 'このおみくじの処理内容',
        },
        command: {
          label: '制御の種類',
          description: '処理の流れを制御する方法',
        },
      },
      control: {
        label: '評価ブロック',
        description: 'この制御の実行時に評価',
      },
      criteria: {
        label: '適用する発動条件',
        description: 'トリガーの種類',
        help: {
          conditionName: '',
          conditionDescription: '【追加発動条件】は、コメント内容やチャット数などを基に、イベントの発動を制御',
          allRequired: '複数の条件がある場合、すべて満たすと発動',
          adminCommands: '管理者限定コマンドなどにも応用可能',
          empty: '発動条件が指定されていません',
        },
      },
    },
  },
  en: {
    omikujiItem: {
      cooldownHelp: {
        title: 'About cooldown (seconds)',
        summary:
          'After this item runs, items with a smaller value are blocked for that many seconds. Items with the same or a larger value are not blocked.',
        basis: 'Only the most recently run item is used as the reference.',
        zero: 'Items with 0 or no value never block others, but they can be blocked.',
        negative: 'Negative values work too. -3 blocks items with a value below -3 (-4 or less) for 3 seconds.',
        blocked:
          'A blocked run posts nothing and is not retried later. For comments, the remaining events are not checked either.',
        examplesTitle: 'Examples',
        example1: 'Set the first-time greeting to 5 → for 5 seconds it cannot be overwritten by a 0 scheduled notice.',
        example2:
          'Set a rare fortune to 10 → for 10 seconds, normal fortunes cannot cut in (keeps time for the effect).',
      },
      list: {
        testTooltip: 'Start OneComme to preview the post',
        test: 'Test draw',
        add: 'Add omikuji',
        columns: 'Omikuji / Scenario / Cooldown',
        headerOmikuji: 'Omikuji',
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
        },
      },
      header: {
        name: {
          label: 'Fortune type',
          description: 'Enter an easy-to-identify name',
        },
        cooldown: {
          label: 'Cooldown',
          description: 'After this runs, blocks items with a smaller value for this many seconds',
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
          conditionDescription:
            ' let you control event triggers based on comment content, chat count, and similar criteria.',
          allRequired: 'If multiple conditions are set, all of them must be met for the event to trigger.',
          adminCommands: 'You can also configure advanced options, such as commands limited to administrators.',
          empty: 'No trigger conditions have been specified',
        },
      },
    },
  },
} as const
