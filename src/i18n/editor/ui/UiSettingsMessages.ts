// src/i18n/editor/ui/UiSettingsMessages.ts
// SettingItem の labelKey / descriptionKey 用 (src/ui/*/editor, src/editor/ui)

export const uiSettingsMessages = {
  ja: {
    uiSettings: {
      common: {
        color: {
          label: 'カラー設定',
          description: '表示するカラーを設定します',
        },
        bubbleMotion: {
          label: 'フキダシアニメーション',
          description: 'フキダシの表示アニメーションを設定します',
        },
        displayStyle: {
          label: '表示スタイル',
          description: '表示形式を選択',
        },
      },
      userBoard: {
        component: {
          label: '表示のしかた',
          description: '個人の得点リスト・チームの得点(2種類)から選べます',
        },
        color: {
          label: 'カラー設定',
          description: '表示するカラーを設定します(チームの色は、LiveConsole で割り当てた色になります)',
        },
        limit: {
          label: '表示件数',
          description: '得点リストに表示する人数を設定します(最大30)',
        },
      },
      toastWidgets: {
        position: {
          label: 'トースト位置',
          description: '通知メッセージを右側に表示するかどうか',
        },
        showCharacter: {
          label: 'キャラクター表示',
          description: 'トーストにキャラクターアイコンを表示するか',
        },
        thumbnail: {
          label: 'サムネイル表示キャラクター',
          description: '右下にサムネイルとして表示するキャラクターを選択します',
        },
      },
      commentBubble: {
        persistentCharacter: {
          label: '常時表示キャラクター',
          description: '未設定の場合、コメントが来たときのみ表示されます',
        },
        characterSize: {
          label: 'キャラクターの大きさ',
          description: 'キャラクター画像の横幅を調整します',
        },
      },
      characterStage: {
        characterSize: {
          label: 'キャラクターの大きさ',
          description: '標準の横幅です。投稿ごとの「サイズ倍率」がこの値にかかります',
        },
        seconds: {
          label: '既定の表示秒数',
          description: '投稿で秒数を指定しなかったときの秒数です(0 は無期限)',
        },
        motion: {
          label: '既定の登場・退場アニメーション',
          description: '登場と退場で同じモーションを使います',
        },
        x: {
          label: '既定の位置X',
          description: '0〜100(%)。キャラの中心が基準。最小と最大が違えば範囲内でランダム',
        },
        y: {
          label: '既定の位置Y',
          description: '0〜100(%)。画面上端が 0、キャラの下辺が基準',
        },
      },
      streamCounter: {
        theme: {
          label: 'テーマ',
          description: 'カラーテーマを選択します',
        },
        labelStyle: {
          label: 'ラベルスタイル',
          description: 'カウンターのラベル表示方法を選択',
        },
      },
      colorCycle: {
        odd: {
          label: '単色・奇数カラー',
          description: '基本となるカラーを選択します',
        },
        even: {
          label: '偶数カラー',
          description: 'ツートンにする場合の2色目',
        },
        custom: {
          label: 'カスタム入力',
          description: 'カンマ区切りで直接入力',
        },
      },
      counterSelector: {
        default: {
          label: '標準カウンター',
          description: '表示したい項目を選択してください',
        },
        variable: {
          label: '評価ブロックカウンター',
          description: '評価ブロック名とラベルを入力',
        },
      },
      liveClock: {
        defaultMessage: {
          label: 'デフォルトメッセージ',
          description: 'プレースホルダーが使えます',
        },
        isDate: {
          label: '日付表示',
          description: '時計に日付を表示するか',
        },
        isSecond: {
          label: '秒数表示',
          description: '時計に秒数を表示するか',
        },
      },
      kujibikiPanel: {
        title: {
          label: 'タイトル',
          description: 'タイトルを設定します',
        },
        displaySeconds: {
          label: '表示時間（秒）',
          description: '0なら常時表示します',
        },
        imagePath: {
          label: '画像パス',
          description: '顔ハメ看板のフレーム画像を指定します',
        },
        iconSize: {
          label: 'アイコンサイズ',
          description: '中央に配置するアイコンの大きさを設定します',
        },
      },
      gameRanking: {
        sortOrder: {
          label: '順位のソート',
          description: '得点の高い順・低い順・新しい順から選べます',
        },
        limit: {
          label: '表示件数',
          description: 'ランキングに表示する件数を設定します(最大20)',
        },
        uniqueUser: {
          label: 'ユーザーごとに1件だけ表示',
          description: '同じユーザーの記録は、最新の1件だけを表示します',
        },
      },
      cookieCounter: {
        mainImage: {
          label: 'メイン画像',
          description: '1つ目に使う画像ファイルのパス',
        },
        subImage: {
          label: 'サブ画像',
          description: '2つ目の画像パス。空欄ならメイン画像を使用',
        },
      },
      fontFamily: {
        label: 'フォントファミリー',
        description: '表示に使用するフォント',
      },
      layout: {
        label: 'レイアウト',
        description: 'ジェネレーターで使用するレイアウト',
      },
      unused: {
        label: '未使用UIの設定',
        description: '現在の設定で使わないUI設定を削除',
      },
    },
  },
  en: {
    uiSettings: {
      common: {
        color: {
          label: 'Color',
          description: 'Set the display color',
        },
        bubbleMotion: {
          label: 'Bubble animation',
          description: 'Set the display animation of the bubble',
        },
        displayStyle: {
          label: 'Display style',
          description: 'Choose the display format',
        },
      },
      userBoard: {
        component: {
          label: 'Display mode',
          description: 'Choose between the individual score list and team scores (2 types)',
        },
        color: {
          label: 'Color',
          description: 'Set the display color (team colors use the colors assigned in LiveConsole)',
        },
        limit: {
          label: 'Number of entries',
          description: 'Set how many people appear in the score list (max 30)',
        },
      },
      toastWidgets: {
        position: {
          label: 'Toast position',
          description: 'Whether to show notification messages on the right side',
        },
        showCharacter: {
          label: 'Show character',
          description: 'Whether to show a character icon on the toast',
        },
        thumbnail: {
          label: 'Thumbnail characters',
          description: 'Choose the characters shown as thumbnails at the bottom right',
        },
      },
      commentBubble: {
        persistentCharacter: {
          label: 'Always-visible character',
          description: 'If not set, the character appears only when a comment arrives',
        },
        characterSize: {
          label: 'Character size',
          description: 'Adjust the width of the character image',
        },
      },
      characterStage: {
        characterSize: {
          label: 'Character size',
          description: 'The default width. Each post\'s "size multiplier" is applied to this value',
        },
        seconds: {
          label: 'Default display time',
          description: 'Seconds used when a post does not specify a duration (0 = no limit)',
        },
        motion: {
          label: 'Default enter/exit animation',
          description: 'The same motion is used for both entering and exiting',
        },
        x: {
          label: 'Default position X',
          description:
            "0–100 (%). Based on the character's center. If min and max differ, a random position within the range is used",
        },
        y: {
          label: 'Default position Y',
          description: '0–100 (%). 0 is the top of the screen; based on the bottom edge of the character',
        },
      },
      streamCounter: {
        theme: {
          label: 'Theme',
          description: 'Choose a color theme',
        },
        labelStyle: {
          label: 'Label style',
          description: 'Choose how counter labels are displayed',
        },
      },
      colorCycle: {
        odd: {
          label: 'Single / odd color',
          description: 'Choose the base color',
        },
        even: {
          label: 'Even color',
          description: 'The second color for a two-tone look',
        },
        custom: {
          label: 'Custom input',
          description: 'Enter directly, separated by commas',
        },
      },
      counterSelector: {
        default: {
          label: 'Standard counters',
          description: 'Select the items you want to display',
        },
        variable: {
          label: 'Evaluation block counters',
          description: 'Enter the evaluation block name and a label',
        },
      },
      liveClock: {
        defaultMessage: {
          label: 'Default message',
          description: 'Placeholders can be used',
        },
        isDate: {
          label: 'Show date',
          description: 'Whether to show the date on the clock',
        },
        isSecond: {
          label: 'Show seconds',
          description: 'Whether to show seconds on the clock',
        },
      },
      kujibikiPanel: {
        title: {
          label: 'Title',
          description: 'Set the title',
        },
        displaySeconds: {
          label: 'Display time (seconds)',
          description: '0 means always visible',
        },
        imagePath: {
          label: 'Image path',
          description: 'Specify the frame image for the face-in-hole board',
        },
        iconSize: {
          label: 'Icon size',
          description: 'Set the size of the icon placed at the center',
        },
      },
      gameRanking: {
        sortOrder: {
          label: 'Ranking sort',
          description: 'Choose from highest score, lowest score, or newest first',
        },
        limit: {
          label: 'Number of entries',
          description: 'Set how many entries appear in the ranking (max 20)',
        },
        uniqueUser: {
          label: 'One entry per user',
          description: 'Only the latest record of each user is shown',
        },
      },
      cookieCounter: {
        mainImage: {
          label: 'Main image',
          description: 'Path of the first image file to use',
        },
        subImage: {
          label: 'Sub image',
          description: 'Path of the second image. If empty, the main image is used',
        },
      },
      fontFamily: {
        label: 'Font family',
        description: 'The font used for display',
      },
      layout: {
        label: 'Layout',
        description: 'The layout used by the generator',
      },
      unused: {
        label: 'Unused UI settings',
        description: 'Delete UI settings that are not used with the current layout',
      },
    },
  },
} as const
