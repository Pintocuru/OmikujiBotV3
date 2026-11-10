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
        unregisteredDescription: 'このバージョンには含まれていません',
        resetToDefault: '既定に戻す',
        defaultOption: '(既定: {value})',
        defaultOnly: '(既定)',
        emptyMessage: '(未記入)',
        loadError: {
          unregistered: '未登録の表示タイプ: {id}',
          loadFailed: '表示タイプ「{id}」の読み込みに失敗しました',
        },
      },
      characterStage: {
        noSettings: {
          line1: 'シナリオで個別に編集するものです。',
          line2: '設定できる項目がありません。',
        },
        preview: {
          noImageCharacter: '画像のあるキャラクターがありません',
          spawn: '登場',
          hideAll: '消す',
        },
        slots: {
          hint: '空欄の項目は既定値が使われます',
          secondsUnit: '秒(0 は無期限)',
          anchorHint: '位置X・Yに置く、キャラ画像上の点',
          scaleUnit: '倍(実寸 {px}px)',
          durationUnit: '秒(小さいほど速い)',
          clearYes: '消す',
          clearNo: '消さない',
          axisX: {
            label: '位置X',
            description: '0〜100(%)。左端が 0。違う値ならランダム',
          },
          axisY: {
            label: '位置Y',
            description: '0〜100(%)。上端が 0。違う値ならランダム',
          },
          anchors: {
            topLeft: '左上',
            top: '上中央',
            topRight: '右上',
            left: '左中央',
            center: '中央',
            right: '右中央',
            bottomLeft: '左下',
            bottom: '下中央',
            bottomRight: '右下',
          },
        },
      },
      lifeHourglass: {
        carryOver: {
          label: '前回までの砂粒を引き継ぐ',
          descriptionOn: 'ON: 前回までの通算を表示します / OFF: 今回の配信ぶんだけを表示します',
          descriptionUnavailable: 'サーバーがないため、現在は使用できません(起動しごとに 0 に戻ります)',
        },
        preview: {
          viewer: '同接',
          time: '時間',
          gift: 'ギフト',
          reset: 'リセット',
          add10s: '+10秒',
          add1m: '+1分',
          add10m: '+10分',
          add1h: '+1時間',
        },
      },
      slots: {
        gameRanking: {
          gameKey: {
            title: 'ゲームキー',
            description: 'ゲームの認識キー(任意)',
          },
          listName: {
            title: 'ユーザー名',
            description: '表示名。空なら user.userName を使う',
          },
          symbol: {
            title: 'シンボル',
            description: 'ユーザー名の右側につく記号',
          },
          scoreText: {
            title: '得点(文字)',
            description: '表示用の得点',
          },
          score: {
            title: '得点(数値)',
            description: '並び順を決める(表示しない)',
          },
        },
        kujibikiPanel: {
          result: {
            title: '結果',
            description: '運勢などの見出し(例: 大吉)',
          },
          detail: {
            title: '解説',
            description: '結果の解説文',
          },
        },
        characterStage: {
          seconds: {
            title: '表示秒数',
            description: '0 は無期限。空なら既定値',
          },
          xMin: {
            title: '位置X 最小',
            description: '0〜100(%)。最小と最大が同じなら固定、違えば範囲内でランダム',
          },
          xMax: {
            title: '位置X 最大',
            description: '0〜100(%)',
          },
          yMin: {
            title: '位置Y 最小',
            description: '0〜100(%)。画面上端が 0',
          },
          yMax: {
            title: '位置Y 最大',
            description: '0〜100(%)',
          },
          scale: {
            title: 'サイズ倍率',
            description: '1 が標準。空なら 1',
          },
          motion: {
            title: '登場・退場モーション',
            description: 'モーションのキー(例: fade, slideUp)。空なら既定値',
          },
          clearPrevious: {
            title: '前の表示を消す',
            description: 'true なら、これまでの表示を消してから表示する',
          },
          motionDuration: {
            title: 'アニメーション速度',
            description: '登場・退場のモーションの秒数。0.4〜5(小さいほど速い)。空なら 1',
          },
          anchor: {
            title: '基準点',
            description: '位置X・Yが、キャラ画像のどの点か(例: bottomRight)。空なら既定値',
          },
        },
      },
      userBoard: {
        liveConsoleNote:
          'LiveConsole(console.html)で操作した、ユーザーの得点・チームが表示されます。プレビューはダミーです。',
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
        sideRight: '右側に表示する',
        sideLeft: '左側に表示する',
        showCharacterToggle: 'キャラクターを表示する',
        previewHint: '(OBSの対話モードでマウスを近づけると、キャラクターが表示され投稿テストができます)',
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
        orderTitle: '表示順(最大 {max} 個): 現在 {count} 個',
        form: {
          variableName: '変数名',
          variablePlaceholder: 'point など',
          displayName: '表示名',
          displayPlaceholder: 'ポイント',
          add: '追加',
          save: '保存',
          cancel: 'キャンセル',
        },
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
        subImagePlaceholder: '空欄でメインと同じ画像',
        incrementAll: '🎲 全て +1',
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
