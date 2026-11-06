// src/sdk/subscribe/GetServiceMeta.ts
import { PingOneSDK } from '@/sdk/connection/PingOneSDK'
import { fetchServices } from '@/sdk/service/fetchServices'
import type { Service, ServiceMeta } from '@onecomme.com/onesdk/types/Service'

// サービスメタを取得する間隔(ミリ秒)
const META_POLL_INTERVAL_MS = 500
// 連続で取得に失敗したとき、onError で知らせる回数
const META_FETCH_ERROR_NOTIFY_COUNT = 10

type MetaResult = { ok: true; data: ServiceMeta[] } | { ok: false; error: unknown }

export class ServiceMetaWatcher {
  private metaCache: ServiceMeta[] = []
  private pollingInterval: ReturnType<typeof setInterval> | null = null
  private pollGeneration = 0 // 開始・停止のたびに進める(停止後に届いた古い応答で callback を呼ばないため)
  private isFetching = false // 取得中は次の取得を始めない(応答が遅いとき、古い応答が新しい値を上書きしないようにする)
  private errorStreak = 0 // 連続で取得に失敗した回数
  private isInitialized = false
  private static instance: ServiceMetaWatcher | null = null

  static getInstance(): ServiceMetaWatcher {
    if (!this.instance) this.instance = new ServiceMetaWatcher()
    return this.instance
  }

  /**
   * わんコメのサービス一覧を取得(Service.id などが必要なとき用)
   */
  async fetchServices(): Promise<Service[]> {
    return fetchServices()
  }

  /**
   * ライブ配信中のメタ情報を取得
   */
  private async fetchLiveMeta(): Promise<MetaResult> {
    try {
      const services = await fetchServices()

      // 配信中のサービスのメタを配列で返す
      return { ok: true, data: services.flatMap((s) => (s.meta?.isLive ? [s.meta] : [])) }
    } catch (error) {
      return { ok: false, error }
    }
  }

  /**
   * ポーリングを開始（0.5秒ごとに最新のメタ情報を取得）
   * 取得に失敗したときは callback を呼ばない(「配信していない」と区別するため)。
   * 連続で失敗が続いたときだけ、onError で1回知らせる。
   */
  private startPolling(callback: (meta: ServiceMeta[]) => void, onError?: (error: unknown) => void) {
    this.stopPolling()
    this.errorStreak = 0
    const generation = this.pollGeneration

    this.pollingInterval = setInterval(async () => {
      if (this.isFetching) return
      this.isFetching = true
      try {
        const result = await this.fetchLiveMeta()
        if (generation !== this.pollGeneration) return // 取得中に停止・再開始された

        if (!result.ok) {
          this.errorStreak++
          if (this.errorStreak === META_FETCH_ERROR_NOTIFY_COUNT) onError?.(result.error)
          return
        }
        this.errorStreak = 0

        // 配列でキャッシュ
        this.metaCache = result.data

        // 配列で返す
        callback(result.data)
      } finally {
        this.isFetching = false
      }
    }, META_POLL_INTERVAL_MS)
  }

  /**
   * ポーリングを停止
   */
  stopPolling() {
    this.pollGeneration++
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval)
      this.pollingInterval = null
    }
  }

  /**
   * メタ情報の取得を開始（必要であれば PingOneSDK を初期化）
   */
  async fetchMeta(
    callback: (meta: ServiceMeta[]) => void,
    onError?: (error: unknown) => void
  ): Promise<{ ok: boolean }> {
    if (!this.isInitialized) {
      const ok = await PingOneSDK()
      if (!ok) return { ok: false }

      this.isInitialized = true
    }

    this.startPolling(callback, onError)
    return { ok: true }
  }

  /**
   * 現在キャッシュされているメタ情報を取得
   */
  getCurrentMeta() {
    return this.metaCache
  }
}
