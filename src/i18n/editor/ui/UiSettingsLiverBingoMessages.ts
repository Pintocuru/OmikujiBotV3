// src/i18n/editor/ui/UiSettingsLiverBingoMessages.ts
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
        },
      },
    },
  },
} as const
