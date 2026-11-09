// server/types/index.ts
import type { MetaDataType } from '@/types/core/MetaDataSchema'

export interface FileItem {
  name: string
  modified: string
  meta?: MetaDataType // 読めない・無いファイルは undefined
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
  /** sounds フォルダ (音声ファイル一覧の取得元) */
  soundsDir: string
  /** 画像ルート (画像一覧の取得元)。複数のルートの中身を1つの一覧にまとめる。実行のたびに読み直すため getter でもよい */
  imagesDirs: readonly string[]
  /** 開発用のアクション (ダミーデータの追加など) を許可するか。Express の開発サーバーだけ true */
  allowMock?: boolean
}
