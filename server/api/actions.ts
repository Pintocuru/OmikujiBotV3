// server/api/actions.ts
// クライアント (src/manager/services) とサーバ (server/core/router.ts) が共有する API 契約。
// アクションを追加するときは、ここに1行足してからルーターとクライアントを実装する。
// ※ クライアントからも import されるため、Node 依存の import は置かないこと。

/**
 * API のバージョン (health で返す。クライアントとサーバー (プラグイン) の組み合わせ確認に使う)
 * - 互換性のない変更 (アクションの削除・リクエスト/レスポンスの必須項目の変更など) のときだけ +1 する
 * - アクションや応答項目を足すだけなら上げない (古いクライアントはそのまま動くため)
 * - プラグインは更新されないまま、コンソールだけ新しくなることがある。クライアントは API_VERSION より
 *   小さい (apiVersion が無いときは 0 とみなす) サーバーに、新しいアクションを呼ばないこと
 */
export const API_VERSION = 1 // TODO:これってアプリバージョンといっしょにしていいの?

export const API_ACTION = {
  // GET
  health: { method: 'GET', action: 'health' },
  list: { method: 'GET', action: 'list' },
  load: { method: 'GET', action: 'load' },
  loadGenerator: { method: 'GET', action: 'load-generator' },
  listPackages: { method: 'GET', action: 'list-packages' },
  listGameStates: { method: 'GET', action: 'list-game-states' },
  loadGameState: { method: 'GET', action: 'load-game-state' },
  loadUserStats: { method: 'GET', action: 'load-user-stats' },
  loadUsers: { method: 'GET', action: 'load-users' },
  loadPadStatus: { method: 'GET', action: 'load-pad-status' },
  loadBingoCommands: { method: 'GET', action: 'load-bingo-commands' },
  loadBingoSnapshot: { method: 'GET', action: 'load-bingo-snapshot' },
  listBingoPatterns: { method: 'GET', action: 'list-bingo-patterns' },
  loadBingoPattern: { method: 'GET', action: 'load-bingo-pattern' },
  loadGameConfig: { method: 'GET', action: 'load-game-config' },

  // POST
  move: { method: 'POST', action: 'move' },
  save: { method: 'POST', action: 'save' },
  delete: { method: 'POST', action: 'delete' },
  saveGenerator: { method: 'POST', action: 'save-generator' },
  deletePackage: { method: 'POST', action: 'delete-package' },
  saveOmikuji: { method: 'POST', action: 'save-omikuji' },
  appendGameLog: { method: 'POST', action: 'append-game-log' },
  appendGameLogs: { method: 'POST', action: 'append-game-logs' },
  deleteGameState: { method: 'POST', action: 'delete-game-state' },
  updateUserStats: { method: 'POST', action: 'update-user-stats' },
  resetUserStats: { method: 'POST', action: 'reset-user-stats' },
  addManualUser: { method: 'POST', action: 'add-manual-user' },
  removeManualUser: { method: 'POST', action: 'remove-manual-user' },
  resetUsers: { method: 'POST', action: 'reset-users' },
  seedMockUsers: { method: 'POST', action: 'seed-mock-users' }, // 開発サーバー専用 (ctx.allowMock)
  triggerPad: { method: 'POST', action: 'trigger-pad' },
  sendBingoCommand: { method: 'POST', action: 'send-bingo-command' },
  saveBingoSnapshot: { method: 'POST', action: 'save-bingo-snapshot' },
  saveBingoPattern: { method: 'POST', action: 'save-bingo-pattern' },
  deleteBingoPattern: { method: 'POST', action: 'delete-bingo-pattern' },
  saveGameConfig: { method: 'POST', action: 'save-game-config' },
} as const

type ApiActionEntry = (typeof API_ACTION)[keyof typeof API_ACTION]

/** 全アクション名 ('health' | 'list' | ...) */
export type ApiActionName = ApiActionEntry['action']

/** GET で呼ぶアクション名 */
export type GetActionName = Extract<ApiActionEntry, { method: 'GET' }>['action']

/** POST で呼ぶアクション名 */
export type PostActionName = Extract<ApiActionEntry, { method: 'POST' }>['action']
