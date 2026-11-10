// src/i18n/editor/content/TopPageMessages.ts
export const topPageMessages = {
  ja: {
    topPage: {
      label: 'TOPページ',
      description: '編集する項目を選択',
      count: '{count}件',
      countOne: '{count}件',
      orderHelp: {
        title: 'トリガー(判定)の順番',
        summary: '番号の順に、トリガー(判定)を満たすかを判定します。ドラッグで並び替えられます。',
        comments:
          'コメントは、最初に反応(投稿)したイベントで終了し、以降のイベントは判定しません。「配信者を反応させないようにする」イベントは、先頭に置くと良いでしょう。',
      },
    },
  },
  en: {
    topPage: {
      label: 'Top page',
      description: 'Choose an item to edit',
      count: '{count} items',
      countOne: '{count} item',
      orderHelp: {
        title: 'About the check order',
        summary: 'Trigger conditions are checked in numbered order (top to bottom). Drag to reorder.',
        comments:
          'For comments, checking stops at the first event that responds (posts), and later events are skipped. Put stricter events higher up.',
      },
    },
    devWorld: {
      noData: 'No data',
      welcome: 'Welcome to "DevWorld"...',
    },
  },
} as const
