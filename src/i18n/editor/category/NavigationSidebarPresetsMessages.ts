// src/i18n/editor/category/NavigationSidebarPresetsMessages.ts
export const navigationSidebarPresetsMessages = {
  ja: {
    presets: {
      comments: {
        omikuji: { label: 'おみくじ', description: '「おみくじ」コメントにランダムな運勢を返信' },
        fortune: { label: '占い', description: '「占い」コメントに運勢とラッキーカラー・アイテムを返信' },
        dice: { label: 'ダイス', description: '「ダイス」コメントに1〜6の出目を返信' },
        greeting: { label: '挨拶返し', description: '「こんにちは」などにランダムに返信' },
        excludeUser: {
          label: 'ユーザー除外',
          description: '指定ユーザー（配信者など）をおみくじから除外。追加後にユーザー名を設定',
        },
      },
      timers: {
        hourlyChime: { label: '時報', description: '毎正時に通知' },
        reminder: { label: '定期告知', description: '10分ごとにコメントを促す' },
        viewerWordParty: {
          label: '同時接続数 WordParty',
          description: '30秒ごとに同時接続数と同じ回数だけWordPartyを再生。追加後にIDを設定',
        },
      },
      services: {
        upVotePeak: { label: '高評価 過去最大', description: '高評価数が過去最高を更新するたびに通知' },
        viewerEvery10: { label: '同時接続 10ごと', description: '同時接続数が10の倍数を超えるたびに祝福' },
        followerUp: { label: 'フォロー感謝', description: 'フォロワーが増えたらお礼を伝える' },
        elapsed60: { label: '配信1時間', description: '配信開始から60分後に通知' },
      },
      reactions: {
        maxLevel: { label: '最大レベル達成', description: '最大レベル達成時に「盛り上がってる～」と表示' },
        heartBurst: { label: 'ハート盛り上がり', description: 'ハートが盛り上がったらお礼を伝える' },
      },
      mikuji: {
        omikuji5: { label: 'おみくじ(5段階)', description: '大吉〜凶の5段階のおみくじ箱です' },
        fortune: {
          label: '占い(運勢+ラッキー)',
          description: '運勢とラッキーカラー/アイテム付きの占いです。プレースホルダーも一緒に追加されます',
        },
        coinToss: { label: 'コイントス', description: '表・裏をランダムに返します' },
      },
      scenarios: {
        thanks: { label: 'お礼', description: 'お礼の2秒後にもう一言続ける' },
        cheer: { label: '応援', description: '盛り上げメッセージを1件投稿' },
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
  },
  en: {
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
      scenarios: {
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
  },
} as const
