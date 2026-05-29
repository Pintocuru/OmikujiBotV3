// shared/sdk/subscribe/UserVisits/ServiceVisitManager.ts
import { ServiceVisitSchema, ServiceVisitType } from '../../../types/subscribe/UserVisitSchema'
import { detectServiceFromUrl } from '../../service/DetectService'
import { Service } from '@onecomme.com/onesdk/types/Service'
import { Comment } from '@onecomme.com/onesdk/types/Comment'

/**
 * サービスレベルの訪問データを管理
 */
export class ServiceVisitManager {
  private frames: Service[] | null = null

  setFrames(frames: Service[]): void {
    this.frames = frames
  }

  /**
   * サービスデータの初期化
   */
  initializeService(visits: Record<string, ServiceVisitType>, comment: Comment): boolean {
    /**
     * プロパティ 'service' は型 'Comment' に存在しません。
     */
    const { service: serviceKey } = comment
    let liveId = comment.data?.liveId

    // liveIdがない場合はサービス名を使用（external/system用）
    if (!liveId) {
      liveId = serviceKey
    }

    // サービスが未登録なら初期化
    if (!visits[serviceKey]) {
      visits[serviceKey] = ServiceVisitSchema.parse({ serviceKey, liveId })
    }

    // liveIdは最新のものに更新するが、データはリセットしない
    // ユーザーが明示的にリセットを実行するまでデータは保持される
    if (visits[serviceKey].liveId !== liveId) {
      visits[serviceKey].liveId = liveId // liveIdだけ更新
    }

    visits[serviceKey].totalCount++
    return true
  }

  /**
   * フレームデータの関連付け
   */
  attachFrameData(visits: Record<string, ServiceVisitType>, serviceKey: string): void {
    if (visits[serviceKey].frameData || !this.frames) return

    const frame = this.frames.find((f) => {
      const detectedService = detectServiceFromUrl(f.url)
      return detectedService === serviceKey && f.meta?.isLive
    })

    if (frame) visits[serviceKey].frameData = frame
  }

  /**
   * 統計情報の更新
   */
  updateStatistics(existing: ServiceVisitType, newVisit: ServiceVisitType): void {
    // 差分を加算
    existing.totalCount += newVisit.totalCount
    existing.syokenCount += newVisit.syokenCount
    existing.totalPrice += newVisit.totalPrice
  }
}
