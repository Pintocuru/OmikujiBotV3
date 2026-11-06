// src/sdk/service/ServiceAPI.ts
import { z } from 'zod'
import type { Service } from '@onecomme.com/onesdk/types/Service'
import type { RGBColor } from '@onecomme.com/onesdk/types/Color'
import { postSystemMessage } from '@/sdk/post/PostOneComme'
import { api } from '@/sdk/client'
import { fetchServices, invalidateServicesCache } from './fetchServices'

// ServiceMetaWatcher(0.5秒ごとに取得)の結果を再利用できる時間
const SERVICES_CACHE_MS = 1000
const DEFAULT_POLLING_MS = 10000

// Zodスキーマ定義
const FrameIdSchema = z
  .string()
  .min(4, 'frameIdは4文字以上である必要があります')
  .regex(/^[a-zA-Z0-9_-]+$/, 'frameIdは英数字・アンダースコア・ハイフンのみ使用可能です')

const ColorCodeSchema = z.string().regex(/^#?[0-9A-Fa-f]{6}$/, '6桁のHEX形式で入力してください')

const CreateServiceSchema = z.object({
  name: z.string().min(1, 'サービス名は必須です'),
  frameId: FrameIdSchema,
  color: ColorCodeSchema,
})
type CreateServiceInput = z.infer<typeof CreateServiceSchema>

/**
 * 警告をログに出し、わんコメにも通知する(通知に失敗しても例外にはならない)
 */
function warn(message: string): void {
  console.error(message)
  void postSystemMessage(message, { username: 'warn' })
}

/**
 * HEXカラーコードをRGBColor型に変換
 */
function color2RGB(colorCode: string): RGBColor {
  const hex = colorCode.replace(/^#/, '')

  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)

  return { r, g, b }
}

/**
 * わんコメの枠を管理するAPI
 */
export class ServiceAPI {
  private static instance: ServiceAPI | null = null
  private static creationLock = new Map<string, Promise<Service | null>>()

  private intervalId: ReturnType<typeof setInterval> | null = null
  private onFetchCallback?: (services: Service[] | null) => void

  /**
   * シングルトンインスタンスを取得
   */
  static getInstance(): ServiceAPI {
    if (!ServiceAPI.instance) {
      ServiceAPI.instance = new ServiceAPI()
    }
    return ServiceAPI.instance
  }

  /**
   * わんコメの枠一覧を取得(失敗したら null)
   */
  async getServices(): Promise<Service[] | null> {
    let services: Service[]
    try {
      services = await fetchServices(SERVICES_CACHE_MS)
    } catch (err) {
      console.warn('わんコメの枠情報取得に失敗しました。', err)
      return null
    }

    try {
      this.onFetchCallback?.(services)
    } catch (err) {
      console.error('枠情報の取得コールバックでエラーが発生しました。', err)
    }
    return services
  }

  /**
   * わんコメの新しいサービス（枠）を作成
   * 複数のインスタンスから同時に呼ばれても、同じframeIdでは1回だけ実行される
   */
  async createService(name: string, frameId: string, color: string): Promise<Service | null> {
    const parsed = CreateServiceSchema.safeParse({ name, frameId, color })
    if (!parsed.success) {
      warn(`入力データが無効です: ${parsed.error.issues.map((issue) => issue.message).join(', ')}`)
      return null
    }

    const input = parsed.data
    const lockKey = input.frameId

    // 既に同じframeIdで作成処理が実行中の場合は、その結果を待つ
    const running = ServiceAPI.creationLock.get(lockKey)
    if (running) {
      console.log(`[ServiceAPI] Service creation already in progress for frameId: ${lockKey}`)
      return running
    }

    // 作成処理を開始し、ロックに登録(完了したら解除)
    const creation = this.executeCreateService(input).finally(() => {
      ServiceAPI.creationLock.delete(lockKey)
    })
    ServiceAPI.creationLock.set(lockKey, creation)
    return creation
  }

  /**
   * 実際のサービス作成処理(例外は投げず、失敗時は警告を出して null を返す。通知は1回だけ)
   */
  private async executeCreateService(input: CreateServiceInput): Promise<Service | null> {
    console.log(`[ServiceAPI] Creating service: ${input.name} (${input.frameId})`)

    try {
      const response = await api.post<Service>('/services', {
        id: input.frameId,
        name: `おみくじBOT:${input.name}`,
        speech: true,
        color: color2RGB(input.color),
      })

      if (!response.data) {
        throw new Error('サービス作成: レスポンスにデータがありません')
      }

      invalidateServicesCache()
      console.log(`[ServiceAPI] Service created successfully: ${input.frameId}`)
      return response.data
    } catch (error) {
      warn(`わんコメの枠を作成できませんでした ${error}`)
      return null
    }
  }

  /**
   * サービス情報の定期取得を開始（ポーリング）
   * callback を省略すると、前回指定したコールバックをそのまま使う
   */
  startPolling(callback?: (services: Service[] | null) => void, intervalMs: number = DEFAULT_POLLING_MS): this {
    this.stopPolling()

    if (callback) {
      this.onFetchCallback = callback
    }

    // 初回実行
    void this.getServices()

    this.intervalId = setInterval(() => {
      void this.getServices()
    }, intervalMs)

    return this
  }

  /**
   * サービス情報の定期取得を停止
   */
  stopPolling(): this {
    if (this.intervalId !== null) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    return this
  }
}
