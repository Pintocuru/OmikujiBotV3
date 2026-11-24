// src/generator/stores/MetaState/MetaStateService.ts
import { shallowReactive } from 'vue'
import { MetaFetchStatus, MetaUpdateEvent, NormalizedMeta, ServiceMetaStoreType } from '@/types/generator'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { ServiceMetaWatcher } from '@/sdk/subscribe/GetServiceMeta'
import { isDev } from '@/common/AppEnv'
import { META_OFFLINE_CONFIRM_COUNT } from '@/generator/GeneratorConstants'
import { ServiceMeta } from '@onecomme.com/onesdk/types/Service'

const DEV_DEFAULT_META: NormalizedMeta = {
  isLive: false,
  upVote: 34,
  viewer: 52,
  follower: 4567,
  startTime: Date.now(),
}

/** 外から読む値 (Vue のリアクティブな状態として持つ) */
type MetaState = {
  current: NormalizedMeta | null
  previous: NormalizedMeta | null
  peak: { upVote: number; viewer: number }
  status: MetaFetchStatus
  lastError: unknown | null
}

export class ServiceMetaStore implements ServiceMetaStoreType {
  private static instance: ServiceMetaStore | null = null
  /**
   * 現在値・ピーク・ステータスは、Vue のリアクティブな状態として持つ。
   * getCurrent() などを computed / watch の中で読めば、値が変わったときに画面へ反映される。
   * (値は新しいオブジェクトで差し替えるので、shallow で足りる)
   * 遷移を知りたいとき (配信が始まった瞬間など、前回の値との比較が要るとき) は subscribe を使う。
   */
  private readonly state = shallowReactive<MetaState>({
    current: null,
    previous: null,
    peak: { upVote: 0, viewer: 0 },
    status: 'idle',
    lastError: null,
  })
  private subscribers: Array<(meta: MetaUpdateEvent) => void> = []
  private errorSubscribers: Array<(error: unknown) => void> = []
  private isVirtual = false // 仮想配信パネルから値を上書き中(配信が始まるまで実データで上書きしない)
  private offlineStreak = 0 // 配信中のあと、連続で「配信していない」と取得した回数

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
    this.initialize().catch((e) => this.notifyError(e))
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
    const result = await service.fetchMeta(
      (raw) => {
        try {
          // 配信中のサービスの先頭を使う(いなければ先頭)
          const incoming = raw.find((meta) => meta.isLive) ?? raw[0] ?? null
          if (this.isVirtual) {
            if (!incoming?.isLive) return // 仮想中は、実際に配信が始まるまで値を保つ
            this.isVirtual = false
          }
          if (this.shouldHoldLive(incoming)) return
          this.handleMeta(this.normalize(incoming))
          if (this.state.status === 'loading') this.setStatus('ready')
        } catch (e) {
          this.notifyError(e)
        }
      },
      (e) =>
        console.warn('[MetaStateService] サービスメタの取得に失敗し続けています(取得できるまで、前回の値を使います)', e)
    )

    if (!result?.ok) {
      postSystemMessage(`❌ Meta取得失敗`, { username: 'error', speech: false, throttle: true })
      this.notifyError(new Error('Meta initialization failed'))
    }
  }

  /**
   * ステータスの更新
   */
  private setStatus(next: MetaFetchStatus) {
    this.state.status = next
  }

  /**
   * 配信中から非配信への切り替えを、すぐには反映しない
   * 連続で META_OFFLINE_CONFIRM_COUNT 回確認できてから反映する。
   * 一時的な取得の揺らぎで「配信終了→開始」と判断され、配信開始のリセットが走るのを防ぐ。
   * @returns true のあいだは、取得した値を反映せず前回の値を保つ
   */
  private shouldHoldLive(incoming: ServiceMeta | null): boolean {
    if (incoming?.isLive || !this.state.current?.isLive) {
      this.offlineStreak = 0
      return false
    }
    this.offlineStreak++
    return this.offlineStreak < META_OFFLINE_CONFIRM_COUNT
  }

  /**
   * メタの更新
   */
  private handleMeta(normalized: NormalizedMeta) {
    this.offlineStreak = 0
    this.state.previous = this.state.current
    this.state.current = normalized

    const peakChanged = this.updatePeak(normalized)
    this.notifySubscribers(peakChanged)
  }

  /**
   * サービスメタを正規化されたメタに変換する
   */
  private normalize(raw: ServiceMeta | null): NormalizedMeta {
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
    const { peak } = this.state
    const peakChanged = {
      upVote: meta.upVote > peak.upVote,
      viewer: meta.viewer > peak.viewer,
    }

    // 新しいオブジェクトで差し替える (通知した event が、あとから書き換わらないようにもなる)
    if (peakChanged.upVote || peakChanged.viewer) {
      this.state.peak = {
        upVote: peakChanged.upVote ? meta.upVote : peak.upVote,
        viewer: peakChanged.viewer ? meta.viewer : peak.viewer,
      }
    }

    return peakChanged
  }

  /**
   * サブスクライバーに通知する
   */
  private notifySubscribers(peakChanged: { upVote: boolean; viewer: boolean }) {
    const { current, previous, peak } = this.state
    if (!current) return

    const event: MetaUpdateEvent = { current, previous, peak, peakChanged }

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
    this.state.lastError = error
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
  getStatus(): MetaFetchStatus {
    return this.state.status
  }

  /**
   * エラーの取得
   */
  getLastError(): unknown {
    return this.state.lastError
  }

  /**
   * メタの取得
   */
  getCurrent(): NormalizedMeta | null {
    return this.state.current
  }

  /**
   * ピークの取得
   */
  getPeak() {
    return { ...this.state.peak }
  }

  /**
   * 仮想配信パネル用: NormalizedMeta を部分的に上書きして subscriber に通知する
   * - 配信中(isLive=true)は実データを優先するため何もしない
   */
  _devSetMeta(partial: Partial<NormalizedMeta>) {
    const base = this.state.current ?? DEV_DEFAULT_META
    if (base.isLive) return
    this.isVirtual = true
    this.handleMeta({ ...base, ...partial, isLive: false })
  }

  /**
   * 仮想配信パネル用: 仮想の値をやめて、次回の取得から実データに戻す
   */
  _devReleaseMeta() {
    this.isVirtual = false
  }
}
