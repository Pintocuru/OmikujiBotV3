// src/i18n/ui/UiSettingsFlashBannerMessages.ts
// UI 設定の翻訳: flashBanner
export const uiSettingsFlashBanner = {
  ja: {
    uiSettings: {
      flashBanner: {
        previewHint: 'クリック: 短文・長文の切り替え',
        sampleShort: 'ニュースフラッシュのテストメッセージです！',
        sampleLong:
          'ニュースフラッシュのテストメッセージです！長い文章は枠に収まらないので、ゆっくりスクロールして最後まで読めるようになります。',
        color: {
          label: '配色',
          description:
            'キャラクターがいないとき(コメントがないときの文言など)の色。キャラクターがいるときは、そのキャラクターの色になります',
        },
        label: {
          label: 'ラベル',
          description: 'バナーの端に表示する見出し(例: 速報)。空にすると表示しません',
        },
        showItemOnRight: {
          label: 'ラベル位置',
          description: 'ラベル・アイコンの表示位置',
        },
        left: '左側に表示',
        right: '右側に表示',
        iconSize: {
          label: 'アイコンサイズ',
          description: 'キャラクターのアイコンの大きさ(0 で非表示)',
        },
        scrollSpeed: {
          label: 'スクロール速度',
          description: 'テキストのスクロール速度',
          unit: '{speed}px/秒',
        },
        scrollReturnMode: {
          label: 'スクロール折り返し',
          description: '長文のスクロールが終わったあとの戻り方',
          loop: {
            label: 'ループ',
            description: '端で即座に先頭へ戻る',
          },
          fade: {
            label: 'フェード',
            description: 'フェードアウトして先頭へ戻る',
          },
        },
      },
    },
  },
  en: {
    uiSettings: {
      flashBanner: {
        previewHint: 'Click: switch between short and long text',
        sampleShort: 'This is a test message for the news flash!',
        sampleLong:
          'This is a test message for the news flash! Long text does not fit in the frame, so it scrolls slowly until you can read it to the end.',
        color: {
          label: 'Colors',
          description:
            'Colors used when there is no character (for example, the default message). When a character is shown, its own colors are used',
        },
        label: {
          label: 'Label',
          description: 'A heading shown at the edge of the banner (e.g. Breaking). Leave empty to hide it',
        },
        showItemOnRight: {
          label: 'Label position',
          description: 'Where the label and icon are placed',
        },
        left: 'Show on the left',
        right: 'Show on the right',
        iconSize: {
          label: 'Icon size',
          description: 'Size of the character icon (0 hides it)',
        },
        scrollSpeed: {
          label: 'Scroll speed',
          description: 'How fast the text scrolls',
          unit: '{speed}px/sec',
        },
        scrollReturnMode: {
          label: 'Scroll return',
          description: 'How the text returns after scrolling through long text',
          loop: {
            label: 'Loop',
            description: 'Jump back to the start at the end',
          },
          fade: {
            label: 'Fade',
            description: 'Fade out, then return to the start',
          },
        },
      },
    },
  },
} as const
