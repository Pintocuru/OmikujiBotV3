// src/console/users/maps/UsersMessageMap.ts
// ユーザー操作画面の文言 (日本語)。画面のコンポーネントは、文字をここから取る。
// i18n 化するときは、この map を翻訳ファイルに置き換える (関数の項目は、引数つきの文言)。
export const usersMessages = {
  toolbar: {
    updatedAt: (time: string) => `更新 ${time}`,
    autoRefresh: '自動更新',
    refresh: '更新',
  },
  connection: {
    online: '接続中',
    offline: '未接続',
    error: 'エラー',
    loading: '読み込み中',
  },
  errors: {
    action: (message: string) => `操作に失敗しました: ${message}`,
    mock: (message: string) => `テスト用ユーザーを追加できませんでした: ${message}`,
  },
  toolbox: {
    searchPlaceholder: '名前で検索',
    team: 'チーム',
    teamNone: '-',
    teamNameEdit: 'チーム名',
    teamNameEditTitle: 'チーム名を編集',
    filterAll: 'すべてのチーム',
    filterNone: 'チームなし',
    userCount: (visible: number, total: number) => `${visible} / ${total}人`,
  },
  teamBars: {
    title: 'チーム合計',
    total: (score: string, members: number) => `${score}点 / ${members}人`,
  },
  teamNameDialog: {
    title: 'チーム名を編集',
    description: '空欄にすると、初期の名前に戻ります。',
    placeholder: '初期の名前',
    maxLength: 20,
    save: '保存',
    cancel: 'キャンセル',
    reset: '初期の名前に戻す',
  },
  addRemove: {
    title: 'ユーザーを追加',
    placeholder: '名前(コメントしない人など)',
    add: '追加',
    reset: 'ユーザーを空にする',
    mock: '🧪 テストユーザーを追加',
    mockTitle: '開発用: コメントしたユーザーとして、テスト用のユーザーを追加します(本番では表示されません)',
  },
  table: {
    loading: '読み込み中...',
    noUsers:
      'まだユーザーがいません。コメントがあると、ここに増えていきます。コメントしない人は「ユーザーを追加」から入れられます。',
    noMatch: '該当するユーザーがいません',
    pin: 'ピン',
    user: 'ユーザー',
    team: 'チーム',
    score: '得点',
    manual: '手動',
    commentCount: (count: number) => `${count}回`,
    pinOn: 'ピン留めする (常に先頭に表示)',
    pinOff: 'ピン留めを外す',
    remove: 'このユーザーを削除',
  },
  confirm: {
    resetTitle: 'ユーザーを空にしますか?',
    resetText:
      'コメントしたユーザーの一覧を空にします。手動で追加したユーザーと、得点・チーム・ピン留めは残ります(同じ人が次にコメントすると戻ります)。',
    resetButton: '空にする',
    removeTitle: (userName: string) => `「${userName}」を削除しますか?`,
    removeText: '得点などの記録も消えます。',
  },
} as const
