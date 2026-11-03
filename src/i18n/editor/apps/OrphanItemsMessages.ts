export const orphanItemsMessages = {
  ja: {
    orphans: {
      searching: '検索中...',
      empty: '使われていないアイテムはありません',
      criteria:
        'イベント → みくじ箱 → シナリオ → キャラクター / プレースホルダー と辿れないアイテムです。イベントは、みくじ箱が未設定、または存在しないものです。',
      caution: '削除すると元に戻せません。必要なものがないか、「開く」で確認してから削除してください。',
      open: '開く',
      remove: '削除',
    },
  },
  en: {
    orphans: {
      searching: 'Searching...',
      empty: 'There are no unused items',
      criteria:
        'These items cannot be reached through event → omikuji box → scenario → character / placeholder. An event is listed when its omikuji box is empty or missing.',
      caution: 'Deleting cannot be undone. Use "Open" to check an item before deleting it.',
      open: 'Open',
      remove: 'Delete',
    },
  },
} as const
