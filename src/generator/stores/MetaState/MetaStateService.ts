// src/generator/stores/MetaState/MetaStateService.ts
import { MetaServiceStatus, MetaUpdateEvent, NormalizedMeta, ServiceMetaStoreType } from '@/types/generator'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { ServiceMetaWatcher } from '@/sdk/subscribe/GetServiceMeta'
import { isDev } from '@/types/env'
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service'

const DEV_DEFAULT_META: NormalizedMeta = {
  isLive: false,
  upVote: 34,
  viewer: 52,
  follower: 4567,
  startTime: Date.now(),
}

export class ServiceMetaStore implements ServiceMetaStoreType {
  private static instance: ServiceMetaStore | null = null
  private current: NormalizedMeta | null = null
  private previous: NormalizedMeta | null = null
  private peak = { upVote: 0, viewer: 0 }
  private subscribers: Array<(meta: MetaUpdateEvent) => void> = []
  private lastError: unknown | null = null
  private status: 'idle' | 'loading' | 'ready' | 'error' = 'idle'
  private errorSubscribers: Array<(error: unknown) => void> = []

  /**
   * メタステートサービスのインスタンスを取得する
   */
  static getInstance() {
    if (!this.instance) this.instance = new ServiceMetaStore()
    return this.instance
  }

  /**
   * メタステートサービスのコンストラクタ
   */
  private constructor() {
    this.initialize()
  }

  /**
   * メタステートサービスの初期化
   */
  private async initialize() {
    this.setStatus('loading')

    if (isDev) {
      // 開発モード: ダミーデータで即座に ready にする
      this.handleMeta(DEV_DEFAULT_META)
      this.setStatus('ready')
      return
    }

    const service = ServiceMetaWatcher.getInstance()
    const result = await service.fetchMeta((raw) => {
      try {
        // 配信中のサービスの先頭を使う(いなければ先頭)
        this.handleMeta(raw.find((meta) => meta.isLive) ?? raw[0] ?? null)
        if (this.status === 'loading') this.setStatus('ready')
      } catch (e) {
        this.notifyError(e)
      }
    })

    if (!result?.ok) {
      postSystemMessage(`❌ Meta取得失敗`, { speech: false, throttle: true })
      this.notifyError(new Error('Meta initialization failed'))
    }
  }

  /**
   * ステータスの更新
   */
  private setStatus(next: MetaServiceStatus) {
    this.status = next
  }

  /**
   * メタの更新
   */
  private handleMeta(rawServiceMeta: ServiceMeta | NormalizedMeta | null) {
    const normalized = this.normalize(rawServiceMeta)

    this.previous = this.current
    this.current = normalized

    const peakChanged = this.updatePeak(normalized)
    this.notifySubscribers(peakChanged)
  }

  /**
   * サービスメタを正規化されたメタに変換する
   */
  private normalize(meta: ServiceMeta | NormalizedMeta | null): NormalizedMeta {
    if (meta && 'isLive' in meta && 'follower' in meta) {
      // すでに NormalizedMeta の形の場合（開発時の直接セットなど）
      return meta as NormalizedMeta
    }
    const raw = meta as ServiceMeta | null
    return {
      isLive: raw?.isLive ?? false,
      upVote: this.toNumber(raw?.upVote),
      viewer: this.toNumber(raw?.viewer),
      follower: this.toNumber(raw?.subscriberCount ?? raw?.follower),
      startTime: raw?.startTime ?? null,
    }
  }

  /**
   * ピークの更新
   */
  private updatePeak(meta: NormalizedMeta) {
    const peakChanged = {
      upVote: meta.upVote > this.peak.upVote,
      viewer: meta.viewer > this.peak.viewer,
    }

    if (peakChanged.upVote) this.peak.upVote = meta.upVote
    if (peakChanged.viewer) this.peak.viewer = meta.viewer

    return peakChanged
  }

  /**
   * サブスクライバーに通知する
   */
  private notifySubscribers(peakChanged: { upVote: boolean; viewer: boolean }) {
    if (!this.current) return

    const event: MetaUpdateEvent = {
      current: this.current,
      previous: this.previous,
      peak: this.peak,
      peakChanged,
    }

    for (const fn of this.subscribers) {
      try {
        fn(event)
      } catch (e) {
        console.error('Meta subscriber error', e)
      }
    }
  }

  /**
   * メタ更新の購読
   */
  subscribe(fn: (meta: MetaUpdateEvent) => void): () => void {
    this.subscribers.push(fn)
    return () => {
      this.subscribers = this.subscribers.filter((f) => f !== fn)
    }
  }

  /**
   * 数値に変換する
   */
  private toNumber(value: unknown) {
    const n = Number(value)
    return Number.isFinite(n) ? n : 0
  }

  /**
   * エラー通知
   */
  private notifyError(error: unknown) {
    this.lastError = error
    this.setStatus('error')
    console.error('[MetaStateService]', error)

    for (const fn of this.errorSubscribers) {
      try {
        fn(error)
      } catch {}
    }
  }

  /**
   * エラー購読
   */
  subscribeError(fn: (error: unknown) => void) {
    this.errorSubscribers.push(fn)
    return () => {
      this.errorSubscribers = this.errorSubscribers.filter((f) => f !== fn)
    }
  }

  /**
   * ステータスの取得
   */
  getStatus(): MetaServiceStatus {
    return this.status
  }

  /**
   * エラーの取得
   */
  getLastError(): unknown {
    return this.lastError
  }

  /**
   * メタの取得
   */
  getCurrent(): NormalizedMeta | null {
    return this.current
  }

  /**
   * ピークの取得
   */
  getPeak() {
    return { ...this.peak }
  }

  /**
   * 開発モード専用: NormalizedMeta を部分的に上書きして subscriber に通知する
   */
  _devSetMeta(partial: Partial<NormalizedMeta>) {
    if (!isDev) return
    const base = this.current ?? DEV_DEFAULT_META
    this.handleMeta({ ...base, ...partial })
  }
}
