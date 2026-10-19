// server/core/types.ts
export interface FileItem {
  name: string
  modified: string
}

// 共通の結果型
export interface HandlerResult {
  code: number
  data: any
}

export interface RouteResult {
  code: number
  data: any
}

/**
 * 統一されたリクエスト/レスポンス型
 * プラグインとExpressの違いを吸収する
 */
export interface UnifiedRequest {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE'
  action: string
  params: Record<string, string>
  body: Record<string, any>
}

export interface UnifiedResponse {
  code: number
  data: any
}
