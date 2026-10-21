// server/core/constants.ts
// パス以外の定数をここに集約する。
// ※ API のアクション名は server/api/actions.ts (クライアントと共有) にある。
// ※ パスの基準点 (DIR) は、位置が重要なため server/constants.ts に置いたままにすること。

// server 配下のサブディレクトリ名
export const DIR_NAME = {
  data: 'presets', // ConfigMaker で編集する設定 JSON 群の置き場
  // meta.id ごとの Generator 設定 (packages/<id>.json)。fileName なしの Generator 設定は server 直下の generator.json
  packages: 'packages',
  streams: 'streams', // 1配信ごとのゲームステート (streams/<streamId>.json)
} as const

// 固定ファイル名
export const FILE_NAME = {
  generator: 'generator.json',
  omikujiData: 'omikujiData.js',
  userStats: 'userStats.json', // ブラウザから操作したユーザー統計 (server 直下)
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

// 内部エラーコード (パス検証失敗)
export const INVALID_PATH_CODE = 'EINVALIDPATH'
