// server/core/constants.ts
// パス以外の定数をここに集約する。
// ※ パスの基準点 (DIR) は、位置が重要なため server/constants.ts に置いたままにすること。

// server 配下のサブディレクトリ名
export const DIR_NAME = {
  data: 'presets', // TODO:名称は presets ではないほうがいいと思う
  // TODO: packages(それと、GET_ACTION.loadGenerator ) って何に使っているのか…？
  packages: 'packages',
} as const

// 固定ファイル名
export const FILE_NAME = {
  generator: 'generator.json',
  omikujiData: 'omikujiData.js',
} as const

// 開発用 API サーバー設定 (src/types/env.ts の SERVER_EXPRESS_URL とポートを揃えること)
export const DEV_API = {
  port: 3001,
  bodyLimit: '10mb',
} as const

// HTTP ステータスコード
export const HTTP = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  INTERNAL_ERROR: 500,
} as const

// アクション名 (クライアント側 src/manager/services と同じ文字列。変更しないこと)
// TODO: src/manager/services と一元管理したいので、この定数を使いたい。位置はどうする？
export const GET_ACTION = {
  health: 'health',
  list: 'list',
  load: 'load',
  loadGenerator: 'load-generator',
} as const

export const POST_ACTION = {
  move: 'move',
  save: 'save',
  delete: 'delete',
  saveGenerator: 'save-generator',
  saveOmikuji: 'save-omikuji',
} as const

// 内部エラーコード (パス検証失敗)
export const INVALID_PATH_CODE = 'EINVALIDPATH'
