// server/core/constants.ts
// パス以外の定数をここに集約する。
// ※ API のアクション名は server/api/actions.ts (クライアントと共有) にある。
// ※ パスの基準点 (DIR) は、位置が重要なため server/constants.ts に置いたままにすること。

// server 配下のサブディレクトリ名
export const DIR_NAME = {
  data: 'presets', // ConfigMaker で編集する設定 JSON 群の置き場
  // meta.id ごとの Generator 設定 (packages/<id>.json)。fileName なしの Generator 設定は server 直下の generator.json
  packages: 'packages',
  streams: 'data/streams', // 1配信ごとのゲームステート (data/streams/<streamId>.json)
  bingoPatterns: 'data/bingo-patterns', // ライバービンゴの保存パターン (data/bingo-patterns/<id>.json)
  gameConfigs: 'data/game-configs', // LiveConsole のゲームの設定 (data/game-configs/<gameKey>.json)
} as const

// 固定ファイル名
export const FILE_NAME = {
  generator: 'generator.json',
  omikujiData: 'omikujiData.js',
  userStats: 'userStats.json', // ブラウザから操作したユーザー統計 (data/userStats.json)
  aiSettings: 'ai-settings.json', // 生成 AI の接続先 (data/ai-settings.json)。API キーを含むので、画面・ログ・配布物・Git に出さない
} as const

// 開発用 API サーバー設定 (src/common/AppEnv.ts の SERVER_EXPRESS_URL とポートを揃えること)
export const DEV_API = {
  port: 3001,
  host: '127.0.0.1', // 開発 API は自分の PC からだけ受け付ける
  bodyLimit: '10mb',
  dummyUserCount: 30, // 開発サーバーに入れるダミーユーザーの人数
} as const

// HTTP ステータスコード
export const HTTP = {
  OK: 200,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_ERROR: 500,
  BAD_GATEWAY: 502,
} as const

// 内部エラーコード (パス検証失敗)
export const INVALID_PATH_CODE = 'EINVALIDPATH'
