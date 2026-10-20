// server/types/index.ts
export interface FileItem {
  name: string
  modified: string
}

/**
 * ハンドラー / ルーター共通の結果型
 */
export interface ApiResult<T = any> {
  code: number
  data: T
}

/**
 * 統一されたリクエスト型
 * プラグインとExpressの違いを吸収する
 */
export interface UnifiedRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  action: string
  params: Record<string, string>
  body: Record<string, any>
}

/**
 * 呼び出し元(アダプター)ごとに異なる実行環境
 */
export interface RequestContext {
  /** omikujiData.js の出力先ディレクトリ */
  omikujiOutputDir: string
}
