// shared/sdk/subscribe/GetMetas.ts
import { api } from '../../http/client'
import { PingOneSDK } from '../connection/PingOneSDK'
import { Service, ServiceMeta } from '@onecomme.com/onesdk/types/Service'

type MetaResult = { ok: true; data: ServiceMeta | null } | { ok: false; error: unknown }

export class ServiceMetaWatcher {
  private metaCache: ServiceMeta | null = null
  private pollingInterval: ReturnType<typeof setInterval> | null = null
  private isInitialized = false
  private static instance: ServiceMetaWatcher | null = null

  static getInstance() {
    if (!this.instance) this.instance = new ServiceMetaWatcher()
    return this.instance
  }

  private constructor() {}

  /**
   * ライブ配信中のメタ情報を取得
   */
  private async fetchLiveMeta(): Promise<MetaResult> {
    try {
      const services = await api.get<Service[]>('/services').then((r) => r.data)
      const live = services?.filter((s) => s.meta?.isLive) || []
      return { ok: true, data: live[0]?.meta ?? null }
    } catch (error) {
      return { ok: false, error }
    }
  }

  /**
   * ポーリングを開始（0.5秒ごとに最新のメタ情報を取得）
   */
  private startPolling(callback: (meta: ServiceMeta | null) => void) {
    this.stopPolling()

    this.pollingInterval = setInterval(async () => {
      const result = await this.fetchLiveMeta()

      if (!result.ok) {
        callback(null) // もしくは error 用コールバック
        return
      }

      this.metaCache = result.data
      callback(result.data)
    }, 500)
  }

  /**
   * ポーリングを停止
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
  }

  /**
   * メタ情報の取得を開始（必要であれば PingOneSDK を初期化）
   */
  async fetchMeta(callback: (meta: ServiceMeta | null) => void) {
    if (!this.isInitialized) {
      const ok = await PingOneSDK()
      if (!ok) return { ok: false }

      this.isInitialized = true
    }

    this.startPolling(callback)
    return { ok: true }
  }

  /**
   * 現在キャッシュされているメタ情報を取得
   */
  getCurrentMeta() {
    return this.metaCache
  }
}
