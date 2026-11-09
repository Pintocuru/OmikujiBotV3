// src/i18n/editor/assets/OmikujiItemMessages.ts
// OmikujiItem* の labelKey / descriptionKey 用

export const omikujiItemMessages = {
  ja: {
    omikujiItem: {
      cooldownHelp: {
        title: 'クールダウン(秒)について',
        summary:
          'このおみくじが実行されると、その秒数の間、値がこれより小さいおみくじの実行を止めます。同じ値や大きい値のおみくじは止まりません。',
        basis: '止める基準になるのは、直前に実行された 1 件だけです。',
        zero: '0 や未設定のおみくじは、他のおみくじを止めませんが、止められる側にはなります。',
        negative: 'マイナスの値も使えます。-3 なら 3 秒間、-3 より小さい値(-4 以下)のおみくじを止めます。',
        blocked:
          '止められた回は何も投稿されず、後から再実行もされません。コメントの場合は、以降のイベントの判定も行いません。',
        examplesTitle: '使い方の例',
        example1: '初見さんの挨拶を 5 にする → 5 秒間は、0 の定期案内に上書きされません。',
        example2: 'レアなおみくじを 10 にする → 10 秒間は、通常のおみくじが割り込めません(演出の時間を確保できます)。',
      },
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
          badge: '優先',
          description: '追加条件達成時、優先で選ばれます',
        },
        sectionTitle: '追加条件',
        sectionDescription: 'このおみくじが適用される追加の条件を設定します',
        enable: '設定する',
        priorityEnabledMessage: '適用時、このおみくじが必ず適用されます',
        priorityDisabledMessage: '他のおみくじと同じ抽選を行います',
      },
      scenario: {
        label: 'シナリオ',
        description: 'このおみくじを引いたとき、実行されます',
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
        },
      },
      header: {
        name: {
          label: '運勢の種類',
          description: '識別しやすい名前を入力',
        },
        cooldown: {
          label: 'クールダウン',
          description: '実行後、この秒数の間、これより小さい値のおみくじをブロックします（秒）',
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
