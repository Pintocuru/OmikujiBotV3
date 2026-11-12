// src/i18n/editor/ui/UiSettingsDisplayMessages.ts
// UI 設定の翻訳: userBoard / toastWidgets / commentBubble / streamCounter / counterSelector / liveClock
export const uiSettingsDisplay = {
  ja: {
    uiSettings: {
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
    },
  },
  en: {
    uiSettings: {
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
    },
  },
} as const
