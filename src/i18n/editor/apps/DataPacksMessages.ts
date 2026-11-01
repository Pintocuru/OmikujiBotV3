export const dataPacksMessages = {
  ja: {
    dataPacks: {
      loading: 'データパックを読み込み中...',
      intro: {
        thanks: 'GitHubからダウンロードしてくれてありがとう！',
        free: 'お礼に全機能が使えるデータパックを公開しています。無料だよ！',
        support: 'ただ、サポートはしていません。気軽にカスタムしてみてね。',
      },
      filter: {
        label: 'タグ絞り込み:',
        clear: 'クリア',
        empty: '該当するデータパックが見つかりませんでした',
      },
      refresh: '更新',
      card: {
        partialTooltip: 'この設定を部分的に読み込み/マージ',
        partial: 'マージ',
        replaceTooltip: '現在のデータをこの設定で置き換える',
        replace: '置き換え',
      },
      replaceConfirm: {
        title: '現在のデータを置き換えますか？',
        text: '「{name}」で上書きします。現在の設定はすべて失われます。この操作は取り消せません。',
        confirm: '置き換える',
      },
      loadError: {
        title: '読み込みエラー',
        invalidMetadata: 'このデータはおみくじBOTのデータではありません。',
        unknown: '不明なエラーが発生しました',
      },
      loaded: {
        title: '読み込みました',
        text: '「{name}」を読み込みました。',
      },
      replaceFailed: {
        title: '置き換えに失敗しました',
        console: 'コンソールログをご確認ください',
      },
      partialLoadFailed: {
        title: '読み込みに失敗しました',
        console: 'コンソールログをご確認ください',
      },
    },
  },
  en: {
    dataPacks: {
      loading: 'Loading data packs...',
      intro: {
        thanks: 'Thanks for downloading from GitHub!',
        free: 'As a thank-you, we publish data packs with all features available. They are free!',
        support: 'Please note that these packs are not supported. Feel free to customize them.',
      },
      filter: {
        label: 'Filter by tag:',
        clear: 'Clear',
        empty: 'No matching data packs were found',
      },
      refresh: 'Refresh',
      card: {
        partialTooltip: 'Partially load or merge these settings',
        partial: 'Merge',
        replaceTooltip: 'Replace the current data with these settings',
        replace: 'Replace',
      },
      replaceConfirm: {
        title: 'Replace the current data?',
        text: 'This will overwrite the current settings with "{name}". All current settings will be lost. This cannot be undone.',
        confirm: 'Replace',
      },
      loadError: {
        title: 'Loading error',
        invalidMetadata: 'This data is not an Omikuji Bot data package.',
        unknown: 'An unknown error occurred',
      },
      loaded: {
        title: 'Loaded',
        text: '"{name}" was loaded.',
      },
      replaceFailed: {
        title: 'Failed to replace data',
        console: 'Check the console log for details',
      },
      partialLoadFailed: {
        title: 'Failed to load data',
        console: 'Check the console log for details',
      },
    },
  },
} as const
