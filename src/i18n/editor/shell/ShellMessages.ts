// src/i18n/editor/shell/ShellMessages.ts
export const shellMessages = {
  ja: {
    shell: {
      contentTabs: { dev: '開発' },
      topBar: {
        sidebar: 'メニューを開閉',
        open: '開く',
        openTip: '保存済みのファイルを選んで開きます',
      },
      save: {
        more: '保存先を選ぶ',
        saveAsNew: '新規保存',
        saveAsNewTip: '現在の設定を日付ファイル名で保存して開きます',
        server: 'サーバーに保存',
        serverTip: 'ジェネレーター用設定として保存します',
        omikujiData: 'omikujiData.js に保存',
      },
    },
  },
  en: {
    shell: {
      contentTabs: { dev: 'Dev' },
      topBar: {
        sidebar: 'Toggle menu',
        open: 'Open',
        openTip: 'Choose a saved file to open',
      },
      save: {
        more: 'Choose where to save',
        saveAsNew: 'Save as new',
        saveAsNewTip: 'Save the current settings under a date-based file name and open it',
        server: 'Save to server',
        serverTip: 'Save as the generator configuration',
        omikujiData: 'Save to omikujiData.js',
      },
    },
  },
} as const
