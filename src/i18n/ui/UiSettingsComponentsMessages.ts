// src/i18n/editor/ui/UiSettingsComponentsMessages.ts
// UI 設定の翻訳: kujibikiPanel / gameRanking / cookieCounter / fontFamily / layout / unused / editorSections
export const uiSettingsComponents = {
  ja: {
    uiSettings: {
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
          options: {
            new: '新着順',
            high: 'スコア高い順',
            low: 'スコア低い順',
          },
        },
        limit: {
          label: '表示件数',
          description: 'ランキングの表示件数（最大20）',
        },
        uniqueUser: {
          label: 'ユーザーごとに1件だけ表示',
          description: '同じユーザーは最新の1件のみ表示',
        },
        preview: {
          add: 'ダミーのデータを1件追加',
          clear: 'データを空にする(未記録の表示を確認)',
        },
      },
      cookieCounter: {
        incrementAll: '🎲 全て +1',
        character: {
          label: 'キャラクター{n}',
          description: '表示するキャラクターと表情。回転などの動きは表情の設定に従います',
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
          options: {
            new: 'Newest first',
            high: 'Highest score first',
            low: 'Lowest score first',
          },
        },
        limit: {
          label: 'Number of entries',
          description: 'Set how many entries appear in the ranking (max 20)',
        },
        uniqueUser: {
          label: 'One entry per user',
          description: 'Only the latest record of each user is shown',
        },
        preview: {
          add: 'Add one dummy entry',
          clear: 'Clear all entries (check the empty display)',
        },
      },
      cookieCounter: {
        character: {
          label: 'Character {n}',
          description: 'The character and emotion to show. Motion such as rotation follows the emotion settings',
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
