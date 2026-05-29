// shared/sdk/service/ServiceAPI.ts
import { z } from 'zod'
import { api } from '../../http/client'
import { Service } from '@onecomme.com/onesdk/types/Service'
import { RGBColor } from '@onecomme.com/onesdk/types/Color'
import { postSystemMessage } from '../post/PostOneComme'

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

/**
 * わんコメの枠を管理するAPI
 */
export class ServiceAPI {
  private static instance: ServiceAPI | null = null
  private static creationLock: Map<string, Promise<Service | null>> = new Map()

  private intervalId: ReturnType<typeof setInterval> | null = null
  private intervalMs: number = 10000
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

  private constructor() {}

  /**
   * わんコメの枠一覧を取得
   */
  async getServices(): Promise<Service[] | null> {
    try {
      const services = await api.get<Service[]>('/services').then((r) => r.data)
      this.onFetchCallback?.(services)
      return services
    } catch (err) {
      console.info('わんコメの枠情報取得に失敗しました。', err)
      return null
    }
  }

  /**
   * わんコメの新しいサービス（枠）を作成
   * 複数のインスタンスから同時に呼ばれても、同じframeIdでは1回だけ実行される
   */
  async createService(name: string, frameId: string, color: string): Promise<Service | null> {
    try {
      // Zodでバリデーション
      const validatedData = CreateServiceSchema.parse({ name, frameId, color })
      const lockKey = validatedData.frameId

      // 既に同じframeIdで作成処理が実行中の場合は、その結果を待つ
      if (ServiceAPI.creationLock.has(lockKey)) {
        console.log(`[ServiceAPI] Service creation already in progress for frameId: ${lockKey}`)
        return await ServiceAPI.creationLock.get(lockKey)!
      }

      // 作成処理を開始し、ロックに登録
      const creationPromise = this.executeCreateService(validatedData)
      ServiceAPI.creationLock.set(lockKey, creationPromise)

      try {
        const result = await creationPromise
        return result
      } finally {
        // 処理完了後、ロックを解除
        ServiceAPI.creationLock.delete(lockKey)
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errorMessage = (error as z.ZodError).issues.map((e) => e.message).join(', ')

        const msg = `入力データが無効です: ${errorMessage}`
        console.error(msg)
        postSystemMessage(msg, { username: 'warn' })
      } else {
        const msg = `わんコメの枠を作成できませんでした ${error}`
        console.error(msg)
        postSystemMessage(msg, { username: 'warn' })
      }
      return null
    }
  }

  /**
   * 実際のサービス作成処理
   */
  private async executeCreateService(validatedData: {
    name: string
    frameId: string
    color: string
  }): Promise<Service | null> {
    console.log(`[ServiceAPI] Creating service: ${validatedData.name} (${validatedData.frameId})`)

    const payload = {
      id: validatedData.frameId,
      name: `おみくじBOT:${validatedData.name}`,
      speech: true,
      color: this.color2RGB(validatedData.color),
    }

    try {
      const response = await api.post('/services', payload)

      if (!response.data) {
        throw new Error('サービス作成: レスポンスにデータがありません')
      }

      console.log(`[ServiceAPI] Service created successfully: ${validatedData.frameId}`)
      return response.data as Service
    } catch (error) {
      console.error('サービス作成に失敗しました', error)
      return null
    }
  }

  /**
   * HEXカラーコードをRGBColor型に変換
   */
  private color2RGB(colorCode: string): RGBColor {
    const hex = colorCode.replace(/^#/, '')

    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)

    return { r, g, b }
  }

  /**
   * サービス情報の定期取得を開始（ポーリング）
   */
  startPolling(callback?: (services: Service[] | null) => void, intervalMs: number = 10000): this {
    this.stopPolling()

    this.intervalMs = intervalMs
    if (callback) {
      this.onFetchCallback = callback
    }

    // 初回実行
    this.getServices()

    this.intervalId = setInterval(() => {
      this.getServices()
    }, this.intervalMs)

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
