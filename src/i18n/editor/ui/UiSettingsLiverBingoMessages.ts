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
