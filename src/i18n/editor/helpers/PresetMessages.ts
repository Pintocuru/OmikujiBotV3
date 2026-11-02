export const presetMessages = {
  ja: {
    modalFooter: {
      cancel: 'キャンセル',
      save: '保存',
    },
    saveIssues: {
      count: {
        one: '{count}件',
        other: '{count}件',
      },
      title: {
        one: '読み込み時に{count}件を除外しています',
        other: '読み込み時に{count}件を除外しています',
      },
      description: 'このまま保存すると、除外した要素は保存先から消えます。',
      recommendation: '元のファイルは、保存せずに残しておくことをおすすめします。',
      confirm: '除外したまま保存する',
    },
    presetExport: {
      success: {
        title: '設定ファイルのダウンロードが完了しました',
        description: 'omikujiData.js を同じフォルダに保存し、OBSを再起動してください。',
      },
      invalidData: {
        title: '設定データに問題があります',
        description: 'エラーを修正してから再度お試しください。',
      },
      downloadFailed: {
        title: '設定ファイルのダウンロードに失敗しました',
        description: 'もう一度お試しください。',
      },
      exportFailed: {
        title: '設定ファイルの出力中にエラーが発生しました',
        description: '詳細はコンソールをご確認ください。',
      },
    },
    presetImport: {
      modeLabel: '読み込み方法:',
      merge: 'マージ',
      replace: '置き換え',
      new: '新規',
      settingsLabel: '使用する設定:',
      importedSettings: '読み込み側の設定',
      existingSettings: '既存の設定',
      itemCount: {
        one: '{count}項目',
        other: '{count}項目',
      },
      previewTitle: '設定読み込みプレビュー',
      totalItems: {
        one: '総項目数: {count}',
        other: '総項目数: {count}',
      },
      dataCategories: 'データカテゴリ',
      itemSettings: 'アイテム設定',
      import: '読み込む',
      loadingPreview: 'プレビューデータを読み込み中...',
      conflicts: {
        one: '競合項目 ({count}件):',
        other: '競合項目 ({count}件):',
      },
    },
  },
  en: {
    modalFooter: {
      cancel: 'Cancel',
      save: 'Save',
    },
    saveIssues: {
      count: {
        one: '{count} issue',
        other: '{count} issues',
      },
      title: {
        one: '{count} item was skipped while loading',
        other: '{count} items were skipped while loading',
      },
      description: 'If you save now, the skipped items will be removed from the destination.',
      recommendation: 'We recommend keeping the original file without saving over it.',
      confirm: 'Save without the skipped items',
    },
    presetExport: {
      success: {
        title: 'Configuration file downloaded',
        description: 'Save omikujiData.js in the same folder, then restart OBS.',
      },
      invalidData: {
        title: 'There is a problem with the configuration data',
        description: 'Fix the errors and try again.',
      },
      downloadFailed: {
        title: 'Could not download the configuration file',
        description: 'Please try again.',
      },
      exportFailed: {
        title: 'An error occurred while exporting the configuration',
        description: 'Check the console for details.',
      },
    },
    presetImport: {
      modeLabel: 'Import method:',
      merge: 'Merge',
      replace: 'Replace',
      new: 'New',
      settingsLabel: 'Settings to use:',
      importedSettings: 'Imported settings',
      existingSettings: 'Existing settings',
      itemCount: {
        one: '{count} item',
        other: '{count} items',
      },
      previewTitle: 'Import preview',
      totalItems: {
        one: 'Total: {count} item',
        other: 'Total: {count} items',
      },
      dataCategories: 'Data categories',
      itemSettings: 'Item settings',
      import: 'Import',
      loadingPreview: 'Loading preview data...',
      conflicts: {
        one: 'Conflicting item ({count}):',
        other: 'Conflicting items ({count}):',
      },
      loadErrorUnknown: 'An error occurred while loading the data.',
    },
  },
} as const
