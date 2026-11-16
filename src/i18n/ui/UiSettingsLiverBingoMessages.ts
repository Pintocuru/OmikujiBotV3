// src/i18n/ui/UiSettingsLiverBingoMessages.ts
// UI 設定の翻訳: liverBingo
export const uiSettingsLiverBingo = {
  ja: {
    uiSettings: {
      liverBingo: {
        cardSize: {
          label: 'カードサイズ',
          description: 'ビンゴカードの一辺のマス数',
        },
        color: {
          description:
            '名前: ラインが成立したマスの文字 / テキスト: マスの文字 / 背景: マスの地 / アクセント: 達成・進捗',
        },
        patterns: {
          label: '保存パターン',
          description:
            '今のカードサイズ・固定項目・ランダム項目に名前を付けて保存し、あとで呼び出します(配色は含みません)',
          storage: {
            server: 'サーバーに保存されます',
            browser:
              'サーバーに接続していないため、このブラウザに保存されます(サーバーに接続すると、サーバー側の保存に切り替わります)',
          },
          namePlaceholder: 'パターンの名前(例: 歌枠・初見さん多め)',
          save: '今の設定を保存',
          empty: '保存したパターンはまだありません',
          summary: '{size}×{size} / 固定 {fixed} 個 / ランダム {random} 個',
          apply: '読み込む',
          overwrite: '上書き保存',
          remove: '削除',
          applyConfirm:
            '「{name}」を読み込みます。今のカードサイズ・固定項目・ランダム項目は置き換わります。よろしいですか?',
          overwriteConfirm: '「{name}」を、今の設定で上書き保存します。よろしいですか?',
          removeConfirm: '「{name}」を削除します。元に戻せません。よろしいですか?',
          result: {
            saved: '「{name}」を保存しました',
            overwritten: '「{name}」を上書き保存しました',
            applied: '「{name}」を読み込みました',
            removed: '「{name}」を削除しました',
          },
          error: {
            list: '保存パターンの一覧を読み込めませんでした',
            save: '保存できませんでした(保存先の容量や接続を確認してください)',
            load: 'パターンを読み込めませんでした(削除されたか、形式が違う可能性があります)',
            remove: '削除できませんでした',
          },
        },
        packs: {
          label: 'お題パック',
          description: '雑談・ゲーム・歌枠などのお題のセットを読み込みます(インターネットに接続している必要があります)',
          load: 'パック一覧を読み込む',
          loading: '読み込み中…',
          indexError: 'パック一覧を読み込めませんでした。接続を確認して、もう一度お試しください',
          packError: 'このパックを読み込めませんでした。もう一度お試しください',
          select: '選ぶ',
          back: '一覧に戻る',
          count: '{count} 個のお題が入っています',
          withFixed: '固定項目({count} 個)も取り込む',
          withFixedNote: '今の固定項目は置き換わります。中央に近い空きマスから順に入ります',
          add: 'ランダム項目に追加',
          replace: 'ランダム項目を置き換え',
          replaceConfirm: '今のランダム項目をすべて置き換えます。よろしいですか?',
          result: {
            added: '{added} 件を追加しました({skipped} 件は同じお題があるため追加していません)',
            replaced: '{count} 件に置き換えました',
            fixedSkipped: '固定項目のうち {skipped} 件は、マスが足りず入りませんでした',
          },
        },
        fixedItems: {
          label: '固定項目',
          description:
            '中央の FREE など、位置を決めたいマスのお題を追加します。固定していないマスは、ランダム項目から選ばれます',
          empty: '固定項目はありません(すべてのマスがランダム項目から選ばれます)',
          add: '+ 追加',
          remove: '削除',
          position: '位置(クリックで変更)',
          cell: '{row} 行 {col} 列',
        },
        randomItems: {
          label: 'ランダム項目',
          description: '固定されていないマスに、出現割合に応じて割り当てるお題です',
          add: '+ 追加',
          copy: '複製',
          remove: '削除',
        },
        item: {
          titlePlaceholder: 'お題を入力',
          weight: '出現割合 ({percent}%)',
          target: '達成目標',
          unit: '単位',
          source: {
            label: '進め方',
            manual: '手動(クリック)',
            counterGroup: '配信の数値で自動',
            variable: '評価ブロックの変数で自動',
            variablePlaceholder: '変数名(例: kawaii)',
            counter: {
              syoken: '初見(初コメント)の人数',
              commenter: 'コメントした人数',
              totalComments: 'コメント数',
              totalPrice: 'ギフト金額',
              reaction: 'リアクション数',
              follower: 'チャンネル登録の増加',
              upVote: '高評価の増加',
              viewer: '同時視聴者数(最大)',
            },
            note: {
              auto: '配信の数値が増えると自動で進みます。クリックと LiveConsole の ± は補正になります。',
              totalPrice: '単位を 100 にすると、100 円で 1 進みます。',
              viewer: '同時視聴者数は、お題が出てからの最大値で進みます。',
              variable: '変数は、お題が出てからの増加分で進みます。変数が無い・数値でないときは 0 です。',
            },
          },
        },
      },
    },
  },
  en: {
    uiSettings: {
      liverBingo: {
        cardSize: {
          label: 'Card size',
          description: 'Number of cells per side of the bingo card',
        },
        color: {
          description:
            'Name: text on cells in a completed line / Text: cell text / Background: cell fill / Accent: completed cells and progress',
        },
        patterns: {
          label: 'Saved patterns',
          description:
            'Save the current card size, fixed items and random items under a name and load them later (colors are not included).',
          storage: {
            server: 'Saved on the server.',
            browser:
              'Not connected to the server, so patterns are saved in this browser. (They switch to server storage when you connect.)',
          },
          namePlaceholder: 'Pattern name (e.g. Singing stream)',
          save: 'Save current settings',
          empty: 'No saved patterns yet.',
          summary: '{size}×{size} / {fixed} fixed / {random} random',
          apply: 'Load',
          overwrite: 'Overwrite',
          remove: 'Delete',
          applyConfirm: 'Load "{name}"? Your current card size, fixed items and random items will be replaced.',
          overwriteConfirm: 'Overwrite "{name}" with your current settings?',
          removeConfirm: 'Delete "{name}"? This cannot be undone.',
          result: {
            saved: 'Saved "{name}".',
            overwritten: 'Overwrote "{name}".',
            applied: 'Loaded "{name}".',
            removed: 'Deleted "{name}".',
          },
          error: {
            list: 'Could not load the saved patterns.',
            save: 'Could not save. Check the storage space or the connection.',
            load: 'Could not load the pattern (it may have been deleted or is in an unexpected format).',
            remove: 'Could not delete.',
          },
        },
        packs: {
          label: 'Topic packs',
          description:
            'Load ready-made sets of topics for chat, gaming, singing streams and more (requires an internet connection).',
          load: 'Load pack list',
          loading: 'Loading…',
          indexError: 'Could not load the pack list. Check your connection and try again.',
          packError: 'Could not load this pack. Please try again.',
          select: 'Select',
          back: 'Back to list',
          count: 'Contains {count} topics',
          withFixed: 'Also import fixed items ({count})',
          withFixedNote:
            'Your current fixed items will be replaced. They fill empty cells starting nearest the center.',
          add: 'Add to random items',
          replace: 'Replace random items',
          replaceConfirm: 'This replaces all of your current random items. Continue?',
          result: {
            added: 'Added {added} topics ({skipped} skipped because they already exist).',
            replaced: 'Replaced with {count} topics.',
            fixedSkipped: '{skipped} fixed items did not fit on the card.',
          },
        },
        fixedItems: {
          label: 'Fixed items',
          description:
            'Add topics for cells whose position you want to set, such as a FREE cell in the center. All other cells are filled from the random items.',
          empty: 'No fixed items (every cell is filled from the random items).',
          add: '+ Add',
          remove: 'Remove',
          position: 'Position (click to change)',
          cell: 'Row {row}, column {col}',
        },
        randomItems: {
          label: 'Random items',
          description: 'Topics assigned to the cells that are not fixed, according to their weights.',
          add: '+ Add',
          copy: 'Duplicate',
          remove: 'Remove',
        },
        item: {
          titlePlaceholder: 'Enter a topic',
          weight: 'Weight ({percent}%)',
          target: 'Target',
          unit: 'Unit',
          source: {
            label: 'Progress',
            manual: 'Manual (click)',
            counterGroup: 'Automatic from stream stats',
            variable: 'Automatic from an evaluation-block variable',
            variablePlaceholder: 'Variable name (e.g. kawaii)',
            counter: {
              syoken: 'First-time commenters',
              commenter: 'Unique commenters',
              totalComments: 'Total comments',
              totalPrice: 'Gift amount',
              reaction: 'Reactions',
              follower: 'New followers',
              upVote: 'New likes',
              viewer: 'Concurrent viewers (peak)',
            },
            note: {
              auto: 'Progresses automatically as the stat grows. Clicks and the LiveConsole ± act as corrections.',
              totalPrice: 'With unit 100, every 100 of the currency adds 1.',
              viewer: 'Uses the peak concurrent viewers since the topic appeared.',
              variable: 'Uses the increase since the topic appeared. A missing or non-numeric variable counts as 0.',
            },
          },
        },
      },
    },
  },
} as const
