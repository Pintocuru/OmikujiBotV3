export const editorUiMessages = {
  ja: {
    common: { none: '（なし）' },
    editorUi: {
      dialog: { close: '閉じる' },
      help: { open: 'ヘルプを表示' },
      editDialog: { cancel: 'キャンセル', saveClose: '保存して閉じる' },
      menu: { duplicate: '複製', delete: '削除' },
      characterPicker: { noImage: '画像なし' },
      externalLink: { open: 'サイトを開く' },
      colorPicker: {
        preset: 'プリセット {number}',
        fields: {
          name: '名前の色',
          text: 'テキストの色',
          background: '背景色',
          accent: 'アクセント',
        },
      },
    },
  },
  en: {
    common: { none: '(None)' },
    editorUi: {
      dialog: { close: 'Close' },
      help: { open: 'Show help' },
      editDialog: { cancel: 'Cancel', saveClose: 'Save and close' },
      menu: { duplicate: 'Duplicate', delete: 'Delete' },
      characterPicker: { noImage: 'No image' },
      externalLink: { open: 'Open website' },
      colorPicker: {
        preset: 'Preset {number}',
        fields: {
          name: 'Name color',
          text: 'Text color',
          background: 'Background color',
          accent: 'Accent',
        },
      },
    },
  },
} as const
