// src/console/game/UserRace/maps/UserRaceMessageMap.ts
// ユーザーレース画面の文言 (日本語)。画面のコンポーネントは、文字をここから取る。
// i18n 化するときは、この map を翻訳ファイルに置き換える (関数の項目は、引数つきの文言)。
export const userRaceMessages = {
  title: 'ユーザーレース',
  controls: {
    start: 'スタート',
    again: 'もう一度',
    reset: 'リセット',
    hide: '操作を隠す',
    hint: 'H キーで、操作の表示 / 非表示',
    loading: '読み込み中…',
  },
  notEnough: (min: number) =>
    `走るユーザーが足りません (${min}人以上必要です)。ユーザー操作の画面で、テスト用ユーザーを追加できます`,
  idle: 'スタートを押すと、ユーザーリストから最大8人が走ります (ピン留めのユーザーが優先)',
  result: {
    title: '結果',
    points: (points: number) => `${points} pt`,
    note: 'ユーザーの得点は変わりません (必要なら、ユーザー操作の画面で手動で加算)',
  },
  record: {
    saving: '結果を記録中…',
    saved: (streamId: string) => `結果を GameLog に記録しました (${streamId})`,
    error: (message: string) => `結果を記録できませんでした: ${message}`,
    retry: '再試行',
  },
} as const
