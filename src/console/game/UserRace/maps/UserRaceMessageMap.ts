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
    points: (points: number) => `+${points}点`,
    apply: '得点に加算する',
    applying: '加算中…',
    applied: '加算しました',
    applyError: (message: string) => `得点を加算できませんでした: ${message}`,
    note: '得点は、ボタンを押したときだけ加算されます',
  },
} as const
