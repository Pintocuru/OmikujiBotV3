// src/manager/services/baseApiClient.ts
import axios, { AxiosInstance, AxiosError } from 'axios'
import { getErrorMessage, normalizeApiResponse, NormalizedResponse } from './apiServiceUtils'
import { SERVER_EXPRESS_URL, SERVER_PLUGIN_URL, isDev } from '@/types/env'
import { API_ACTION, GetActionName, PostActionName } from '@server/api/actions'

export class ConnectionError extends Error {
  constructor() {
    super('サーバーに接続できませんでした')
    this.name = 'ConnectionError'
  }
}

/**
 * サーバが code 200 以外を返したときのエラー
 * (HTTP 自体は 200 で、レスポンス body の code に入ってくる)
 */
export class ApiError extends Error {
  constructor(
    message: string,
    readonly code: number,
    readonly serverMessage?: string
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Axiosクライアントを作成
 */
function createClient(isExpressMode: boolean): AxiosInstance {
  const baseURL = isExpressMode ? SERVER_EXPRESS_URL : SERVER_PLUGIN_URL

  const client = axios.create({
    baseURL,
    headers: { 'Content-Type': 'application/json' },
  })

  setupErrorInterceptor(client)
  return client
}

/**
 * エラーハンドリング用インターセプター
 */
function setupErrorInterceptor(client: AxiosInstance): void {
  client.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
      if (error.response) {
        const status = error.response.status

        // 400/404はプラグインなしの想定内 → ConnectionErrorとして返す
        if (status === 400 || status === 404) {
          throw new ConnectionError()
        }

        // URL は常に空なので、アクション名 (params.action) からメッセージを引く
        throw new Error(getErrorMessage(error.config?.params?.action, status))
      }

      if (error.request) {
        throw new ConnectionError()
      }

      throw new Error(`リクエストエラー: ${error.message}`)
    }
  )
}

/**
 * 接続状態 (全サービスで共有)
 * サービスごとに持つと、モード切り替えが他のサービスに反映されないため
 */
const connection = {
  isExpressMode: isDev,
  client: createClient(isDev),
}

/**
 * API通信の基盤クラス
 * 各ドメインAPIクラスはこれを継承して実装する
 */
export abstract class BaseApiClient {
  protected get client(): AxiosInstance {
    return connection.client
  }

  /**
   * GET リクエストの共通処理
   */
  protected async get<T>(
    action: GetActionName,
    additionalParams: Record<string, any> = {}
  ): Promise<NormalizedResponse<T>> {
    const { data } = await this.client.get('', { params: { action, ...additionalParams } })
    return normalizeApiResponse<T>(data)
  }

  /**
   * POST リクエストの共通処理
   */
  protected async post<T>(action: PostActionName, body: Record<string, any>): Promise<NormalizedResponse<T>> {
    // ? わんコメの仕様?により、bodyのほうにparamsを入れる必要がある…？設定ミスかも
    const { data } = await this.client.post('', { action, ...body }, { params: { action } })
    return normalizeApiResponse<T>(data)
  }

  /**
   * レスポンスコードをチェック
   */
  protected validateResponse(response: NormalizedResponse<any>, errorMessage: string): void {
    if (response.code !== 200) {
      throw new ApiError(`${errorMessage} (code: ${response.code})`, response.code, response.data?.error)
    }
  }

  /**
   * APIモードを切り替え（Express ⇔ わんコメプラグイン）
   */
  toggleApiMode(): boolean {
    if (!isDev) return connection.isExpressMode

    connection.isExpressMode = !connection.isExpressMode
    connection.client = createClient(connection.isExpressMode)

    console.log(`[API Mode] ${connection.isExpressMode ? 'Express' : 'わんコメプラグイン'}に切り替えました`)
    return connection.isExpressMode
  }

  /**
   * ヘルスチェック
   */
  async getHealth(): Promise<boolean> {
    try {
      const response = await this.get<any>(API_ACTION.health.action)
      return response.code === 200
    } catch {
      return false
    }
  }
}
