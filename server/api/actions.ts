// server/api/actions.ts
// クライアント (src/manager/services) とサーバ (server/core/router.ts) が共有する API 契約。
// アクションを追加するときは、ここに1行足してからルーターとクライアントを実装する。
// ※ クライアントからも import されるため、Node 依存の import は置かないこと。

export const API_ACTION = {
  // GET
  health: { method: 'GET', action: 'health' },
  list: { method: 'GET', action: 'list' },
  load: { method: 'GET', action: 'load' },
  loadGenerator: { method: 'GET', action: 'load-generator' },
  listGameStates: { method: 'GET', action: 'list-game-states' },
  loadGameState: { method: 'GET', action: 'load-game-state' },
  loadUserStats: { method: 'GET', action: 'load-user-stats' },

  // POST
  move: { method: 'POST', action: 'move' },
  save: { method: 'POST', action: 'save' },
  delete: { method: 'POST', action: 'delete' },
  saveGenerator: { method: 'POST', action: 'save-generator' },
  saveOmikuji: { method: 'POST', action: 'save-omikuji' },
  saveGameState: { method: 'POST', action: 'save-game-state' },
  deleteGameState: { method: 'POST', action: 'delete-game-state' },
  updateUserStats: { method: 'POST', action: 'update-user-stats' },
  resetUserStats: { method: 'POST', action: 'reset-user-stats' },
} as const

type ApiActionEntry = (typeof API_ACTION)[keyof typeof API_ACTION]

/** 全アクション名 ('health' | 'list' | ...) */
export type ApiActionName = ApiActionEntry['action']

/** GET で呼ぶアクション名 */
export type GetActionName = Extract<ApiActionEntry, { method: 'GET' }>['action']

/** POST で呼ぶアクション名 */
export type PostActionName = Extract<ApiActionEntry, { method: 'POST' }>['action']
