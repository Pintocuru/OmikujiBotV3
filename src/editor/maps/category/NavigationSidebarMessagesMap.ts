// src/editor/maps/category/NavigationSidebarMessagesMap.ts
export const navigationSidebarMessages = {
  ja: {
    navigation: {
      presetManager: 'プリセット管理',
      saveFileTip: 'ファイルを保存',
      saveFile: '{name} の保存',
      hasChanged: '変更あり',
      exportConfig: '設定を出力(js)',
      exportConfigTip: '設定ファイルを出力します。保存する場合は必ずこのボタンを押してください。',
      unnamed: '（名前なし）',
      appInfo: 'アプリ情報',
      menu: {
        enable: '有効にする',
        disable: '無効にする',
        duplicate: '複製',
        copyJson: 'JSONコピー',
        pasteJson: 'JSON貼り付け',
        delete: '削除',
        toggleSuccess: '有効・無効を更新しました',
        duplicateSuccess: '項目を複製しました',
        copySuccess: 'JSONをクリップボードにコピーしました',
        copyError: 'コピーに失敗しました',
        pasteReadError: 'クリップボードの読み取りに失敗しました',
        pasteInvalidJson: 'クリップボードの内容が正しいJSON形式ではありません',
        pasteNotObject: 'クリップボードの内容が項目のJSONではありません',
        pasteDiffCategory: 'カテゴリが異なるため貼り付けできません',
        pasteDiffCategoryText: 'コピー元: {source} → 貼り付け先: {target}',
        pasteCrossConfirmTitle: 'カテゴリが異なります',
        pasteCrossConfirmText:
          '「{source}」のデータを「{target}」として貼り付けます。\nトリガーなど一部の設定はリセットされますが、おみくじ設定は引き継がれます。よろしいですか？',
        pasteConfirmButton: '貼り付け',
        pasteValidateError: 'データの検証に失敗しました',
        pasteSuccess: 'JSONを貼り付けました',
        pasteCrossSuccess: '「{source}」から変換して貼り付けました',
        deleteConfirmTitle: '「{name}」を削除しますか？',
        deleteSuccess: '「{name}」を削除しました',
      },
    },
    categories: {
      jsonMerge: {
        label: 'JSONマージ(Dev)',
        description: 'ビルド時、jsonファイルをマージして出力します',
      },
      comments: {
        label: 'コメントイベント',
        description: 'チャット内容やユーザー情報を基におみくじを発動します',
      },
      timers: {
        label: 'タイマーイベント',
        description: '指定した時間経過で、自動的におみくじを発動します',
      },
      services: {
        label: '配信数値イベント',
        description: '配信の視聴数・高評価の変動でおみくじを発動します',
      },
      reactions: {
        label: 'リアクションイベント(Youtube)',
        description: '視聴者のリアクション（❤ 😄 🎉 😳 💯）でおみくじを発動します',
      },
      mikuji: {
        label: 'みくじ箱',
        description: 'おみくじの内容を作成します',
      },
      actions: {
        label: 'アクションセット',
        description: 'BOTのコメント・WordPartyの指定のプリセットを作成します',
      },
      placeholders: {
        label: 'プレースホルダー',
        description: 'コメントやタイマーで利用できる、高性能なプレースホルダーを設定します',
      },
      characters: {
        label: 'キャラクター',
        description: 'BOTメッセージのキャラクターや吹き出し・トーストの色を設定します',
      },
      ui: {
        label: 'アイテム',
        description: 'ジェネレーターで表示できる、アイテムの設定を行います',
      },
      appInfo: {
        label: 'アプリ情報',
        description: 'ライセンスや使用できる機能を確認できます',
      },
    },
  },
  en: {
    navigation: {
      presetManager: 'Preset Manager',
      saveFileTip: 'Save File',
      saveFile: 'Save {name}',
      hasChanged: 'Modified',
      exportConfig: 'Export Config (js)',
      exportConfigTip: 'Export configuration file. Be sure to click this to save.',
      unnamed: '(Unnamed)',
      appInfo: 'App Info',
      menu: {
        enable: 'Enable',
        disable: 'Disable',
        duplicate: 'Duplicate',
        copyJson: 'Copy JSON',
        pasteJson: 'Paste JSON',
        delete: 'Delete',
        toggleSuccess: 'Status updated',
        duplicateSuccess: 'Item duplicated',
        copySuccess: 'Copied JSON to clipboard',
        copyError: 'Failed to copy',
        pasteReadError: 'Failed to read clipboard',
        pasteInvalidJson: 'Clipboard content is not valid JSON',
        pasteNotObject: 'Clipboard content is not an item object',
        pasteDiffCategory: 'Cannot paste due to category mismatch',
        pasteDiffCategoryText: 'Source: {source} → Target: {target}',
        pasteCrossConfirmTitle: 'Categories differ',
        pasteCrossConfirmText:
          'Paste "{source}" data into "{target}".\nSome settings like triggers will be reset, but omikuji settings will be kept. Proceed?',
        pasteConfirmButton: 'Paste',
        pasteValidateError: 'Data validation failed',
        pasteSuccess: 'Pasted JSON successfully',
        pasteCrossSuccess: 'Converted and pasted from "{source}"',
        deleteConfirmTitle: 'Delete "{name}"?',
        deleteSuccess: 'Deleted "{name}"',
      },
    },
    categories: {
      jsonMerge: {
        label: 'JSON Merge (Dev)',
        description: 'Merges and outputs JSON files at build time',
      },
      comments: {
        label: 'Comment Events',
        description: 'Triggers omikuji based on chat or user info',
      },
      timers: {
        label: 'Timer Events',
        description: 'Triggers omikuji automatically at specified intervals',
      },
      services: {
        label: 'Stream Stat Events',
        description: 'Triggers omikuji on viewer count/like changes',
      },
      reactions: {
        label: 'Reactions (YouTube)',
        description: 'Triggers omikuji on viewer reactions (❤ 😄 🎉 😳 💯)',
      },
      mikuji: {
        label: 'Omikuji Box',
        description: 'Creates the omikuji contents',
      },
      actions: {
        label: 'Action Sets',
        description: 'Creates presets for BOT comments and WordParty',
      },
      placeholders: {
        label: 'Placeholders',
        description: 'Configures high-performance placeholders for comments and timers',
      },
      characters: {
        label: 'Characters',
        description: 'Sets characters, speech bubble and toast colors for BOT messages',
      },
      ui: {
        label: 'Items',
        description: 'Configures items displayed in the generator',
      },
      appInfo: {
        label: 'App Info',
        description: 'Check licenses and available features',
      },
    },
  },
} as const
