// src/i18n/editor/ui/UiSettingsMessages.ts
// SettingItem の labelKey / descriptionKey 用 (src/ui/*/editor, src/editor/ui)

export const uiSettingsMessages = {
  ja: {
    uiSettings: {
      common: {
        color: {
          label: 'カラー設定',
          description: '表示カラー',
        },
        bubbleMotion: {
          label: 'フキダシアニメーション',
          description: 'フキダシの表示アニメーション',
        },
        displayStyle: {
          label: '表示スタイル',
          description: '表示形式を選択',
        },
        unregistered: '未登録: {id}',
      },
      userBoard: {
        component: {
          label: '表示のしかた',
          description: '個人の得点リスト・チーム得点（2種類）から選択',
        },
        color: {
          label: 'カラー設定',
          description: '表示カラー（チームの色はLiveConsoleで割り当て）',
        },
        limit: {
          label: '表示件数',
          description: '得点リストの表示人数（最大30）',
        },
      },
      toastWidgets: {
        position: {
          label: 'トースト位置',
          description: '通知メッセージを右側に表示',
        },
        showCharacter: {
          label: 'キャラクター表示',
          description: 'トーストにキャラクターアイコンを表示',
        },
        thumbnail: {
          label: 'サムネイル表示キャラクター',
          description: '右下にサムネイル表示するキャラクター',
        },
      },
      commentBubble: {
        persistentCharacter: {
          label: '常時表示キャラクター',
          description: '未設定ならコメント受信時のみ表示',
          none: 'なし',
        },
        characterSize: {
          label: 'キャラクターの大きさ',
          description: 'キャラクター画像の横幅',
          current: '現在値: {size}px',
        },
        preview: {
          replay: '再表示',
          userName: 'テストユーザー',
          sample1: 'これはプレビュー表示です。',
          sample2: '実際の表示タイプと同じ配置で確認できます。',
        },
      },
      streamCounter: {
        color: {
          add: '色を追加',
          remove: 'この色を削除',
        },
      },
      counterSelector: {
        default: {
          label: '標準カウンター',
          description: '表示する項目を選択',
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
          description: 'タイトル',
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
          description: '中央に配置するアイコンのサイズ',
        },
      },
      gameRanking: {
        sortOrder: {
          label: '順位のソート',
          description: '得点の高い順・低い順・新しい順から選択',
        },
        limit: {
          label: '表示件数',
          description: 'ランキングの表示件数（最大20）',
        },
        uniqueUser: {
          label: 'ユーザーごとに1件だけ表示',
          description: '同じユーザーは最新の1件のみ表示',
        },
      },
      cookieCounter: {
        mainImage: {
          label: 'メイン画像',
          description: '1枚目の画像ファイルのパス',
        },
        subImage: {
          label: 'サブ画像',
          description: '2枚目の画像パス。空欄ならメイン画像を使用',
        },
      },
      fontFamily: {
        label: 'フォントファミリー',
        description: '表示フォント',
        previewTitle: 'プレビュータイトル',
        previewText: 'これはフォント確認用のサンプルです。',
        default: 'デフォルト',
        categories: {
          all: 'すべて',
          gothic: 'ゴシック',
          mincho: '明朝',
          rounded: '丸ゴシック',
          handwriting: '手書き',
          display: '装飾',
        },
      },
      layout: {
        label: 'レイアウト',
        description: 'ジェネレーターで使用するレイアウト',
        mismatch: 'データが不一致です: {details}',
      },
      unused: {
        label: '未使用UIの設定',
        description: '現在の設定で使わないUI設定を削除',
        empty: '削除できる設定はありません',
        delete: '削除',
        deleteAll: '未使用をすべて削除',
        deleteOneConfirm: '「{label}」の設定を削除しますか？',
        deleteAllConfirm: {
          one: '未使用の {count} 件の設定を削除しますか？',
          other: '未使用の {count} 件の設定を削除しますか？',
        },
        deleteSuccess: '削除しました',
      },
      editorSections: {
        layout: {
          label: 'レイアウト',
          description: 'ジェネレーターで使用するレイアウトを切り替え',
        },
        unused: {
          label: '未使用UIの整理',
          description: 'リリース前に不要な UI 設定を削除',
        },
        common: {
          label: 'フォント設定',
          description: '表示フォントを設定',
        },
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
        unregistered: 'Unregistered: {id}',
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
          none: 'None',
        },
        characterSize: {
          label: 'Character size',
          description: 'Adjust the width of the character image',
          current: 'Current: {size}px',
        },
        preview: {
          replay: 'Replay',
          userName: 'Test user',
          sample1: 'This is a preview.',
          sample2: 'You can check it with the same layout as the actual display type.',
        },
      },
      streamCounter: {
        color: {
          add: 'Add color',
          remove: 'Remove this color',
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
        previewTitle: 'Preview title',
        previewText: 'This is sample text for previewing the font.',
        default: 'Default',
        categories: {
          all: 'All',
          gothic: 'Gothic',
          mincho: 'Mincho',
          rounded: 'Rounded Gothic',
          handwriting: 'Handwriting',
          display: 'Display',
        },
      },
      layout: {
        label: 'Layout',
        description: 'The layout used by the generator',
        mismatch: 'Data mismatch: {details}',
      },
      unused: {
        label: 'Unused UI settings',
        description: 'Delete UI settings that are not used with the current layout',
        empty: 'There are no settings to remove',
        delete: 'Delete',
        deleteAll: 'Delete all unused settings',
        deleteOneConfirm: 'Delete the settings for "{label}"?',
        deleteAllConfirm: {
          one: 'Delete {count} unused setting?',
          other: 'Delete {count} unused settings?',
        },
        deleteSuccess: 'Deleted',
      },
      editorSections: {
        layout: {
          label: 'Layout',
          description: 'Switch the layout used by the generator',
        },
        unused: {
          label: 'Clean up unused UI',
          description: 'Remove unnecessary UI settings before release',
        },
        common: {
          label: 'Common settings',
          description: 'Settings shared by all displays, such as fonts',
        },
      },
    },
  },
} as const
