// src/editor/maps/category/NavigationSidebarMessagesMap.ts
// TODO:巨大すぎるので分割したい
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
      groups: {
        events: 'イベント',
        assets: 'アセット',
        ui: 'UI',
        other: 'その他',
      },
      create: {
        button: '新規作成',
        buttonTip: '「{category}」を新しく作成します',
        defaultName: '新しい{category}',
        success: '「{name}」を作成しました',
        emptyMessage: 'ナビゲーションからデータを新規作成してください',
        emptyHint: 'サイドバーの「新規作成」ボタンから追加できます（折りたたんでいる場合は展開してください）',
      },
      preset: {
        buttonTip: '「{category}」のプリセットから作成します',
        title: 'プリセットを新規作成',
        success: 'プリセット「{name}」を追加しました',
      },
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
    presets: {
      comments: {
        omikuji: { label: 'おみくじ', description: '「おみくじ」コメントで運勢をランダムに返します' },
        fortune: { label: '占い', description: '「占い」コメントで運勢とラッキーカラー/アイテムを返します' },
        dice: { label: 'ダイス', description: '「ダイス」コメントで1〜6の出目を返します' },
        greeting: { label: '挨拶返し', description: '「こんにちは」などにランダムに返事します' },
        excludeUser: {
          label: 'ユーザー除外',
          description: '指定ユーザー(配信者)をおみくじから除外します。追加後にユーザー名を設定してください',
        },
      },
      timers: {
        hourlyChime: { label: '時報', description: '毎正時にお知らせします' },
        reminder: { label: '定期告知', description: '10分ごとにコメントを促します' },
        viewerWordParty: {
          label: '同時接続数 WordParty',
          description:
            '30秒ごとに同時接続数の回数だけ WordParty を鳴らします。追加後に WordParty ID を設定してください',
        },
      },
      services: {
        upVotePeak: { label: '高評価 過去最大', description: '高評価が過去最大になるたびにお知らせします' },
        viewerEvery10: { label: '同時接続 10ごと', description: '同時接続数が10の倍数を超えるたびに祝福します' },
        followerUp: { label: 'フォロー感謝', description: 'フォロワーが増えたらお礼を言います' },
        elapsed60: { label: '配信1時間', description: '配信開始から60分でお知らせします' },
      },
      reactions: {
        maxLevel: { label: '最大レベル達成', description: '最大レベル達成時に「盛り上がってる～」と伝えます' },
        heartBurst: { label: 'ハート盛り上がり', description: 'ハートが盛り上がったらお礼を言います' },
      },
      mikuji: {
        omikuji5: { label: 'おみくじ(5段階)', description: '大吉〜凶の5段階のおみくじ箱です' },
        fortune: {
          label: '占い(運勢+ラッキー)',
          description: '運勢とラッキーカラー/アイテム付きの占いです。プレースホルダーも一緒に追加されます',
        },
        coinToss: { label: 'コイントス', description: '表・裏をランダムに返します' },
      },
      actions: {
        thanks: { label: 'お礼', description: 'お礼のあと、2秒後にもう一言続けます' },
        cheer: { label: '応援', description: '盛り上げのメッセージを1件投稿します' },
      },
      placeholders: {
        luckyColor: { label: 'ラッキーカラー', description: '色の候補を9件' },
        luckyItem: { label: 'ラッキーアイテム', description: '身近なアイテムを7件' },
        cheerWord: { label: '応援メッセージ', description: '短い応援の言葉を4件' },
      },
      characters: {
        basic: { label: 'サンプル(オレンジ)', description: '表情6種の枠つき。画像は作成後に設定します' },
        cool: { label: 'クール(青)', description: '青系の配色。画像は作成後に設定します' },
        dark: { label: 'ダーク', description: '暗い背景向けの配色。画像は作成後に設定します' },
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
      groups: {
        events: 'Events',
        assets: 'Assets',
        ui: 'UI',
        other: 'Other',
      },
      create: {
        button: 'New',
        buttonTip: 'Create a new "{category}"',
        defaultName: 'New {category}',
        success: 'Created "{name}"',
        emptyMessage: 'Create new data from the navigation',
        emptyHint: 'Use the "New" button in the sidebar (expand the sidebar if it is collapsed)',
      },
      preset: {
        buttonTip: 'Create "{category}" from a preset',
        title: 'Create from preset',
        success: 'Added preset "{name}"',
      },
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
    presets: {
      comments: {
        omikuji: { label: 'Omikuji', description: 'Replies with a random fortune to the "omikuji" comment' },
        fortune: { label: 'Fortune telling', description: 'Replies with a fortune and lucky color/item to "占い"' },
        dice: { label: 'Dice', description: 'Rolls 1-6 on the "ダイス" comment' },
        greeting: { label: 'Greeting reply', description: 'Replies randomly to greetings' },
        excludeUser: {
          label: 'Exclude user',
          description: 'Excludes specific users (e.g. the streamer) from omikuji. Set the user names after adding',
        },
      },
      timers: {
        hourlyChime: { label: 'Hourly chime', description: 'Announces every hour on the hour' },
        reminder: { label: 'Reminder', description: 'Prompts viewers to comment every 10 minutes' },
        viewerWordParty: {
          label: 'Viewer-count WordParty',
          description:
            'Plays WordParty every 30 seconds as many times as the viewer count. Set the WordParty ID after adding',
        },
      },
      services: {
        upVotePeak: { label: 'Record upvotes', description: 'Announces whenever upvotes hit a new record' },
        viewerEvery10: { label: 'Viewers every 10', description: 'Celebrates each time viewers pass a multiple of 10' },
        followerUp: { label: 'Follower thanks', description: 'Thanks viewers when followers increase' },
        elapsed60: { label: '1 hour elapsed', description: 'Announces 60 minutes after the stream started' },
      },
      reactions: {
        maxLevel: {
          label: 'Max level reached',
          description: 'Says the stream is lively when the max level is reached',
        },
        heartBurst: { label: 'Heart burst', description: 'Thanks viewers when hearts surge' },
      },
      mikuji: {
        omikuji5: { label: 'Omikuji (5 levels)', description: 'A 5-level omikuji box' },
        fortune: {
          label: 'Fortune (with lucky items)',
          description: 'Fortune with lucky color/item. Placeholders are added too',
        },
        coinToss: { label: 'Coin toss', description: 'Returns heads or tails' },
      },
      actions: {
        thanks: { label: 'Thanks', description: 'A thank-you followed by one more line after 2 seconds' },
        cheer: { label: 'Cheer', description: 'Posts one cheering message' },
      },
      placeholders: {
        luckyColor: { label: 'Lucky color', description: '9 colors' },
        luckyItem: { label: 'Lucky item', description: '7 everyday items' },
        cheerWord: { label: 'Cheer words', description: '4 short cheering phrases' },
      },
      characters: {
        basic: { label: 'Sample (orange)', description: 'With 6 emotion slots. Set images after adding' },
        cool: { label: 'Cool (blue)', description: 'Blue palette. Set images after adding' },
        dark: { label: 'Dark', description: 'Palette for dark backgrounds. Set images after adding' },
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
