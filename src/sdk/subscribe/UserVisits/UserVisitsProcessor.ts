// shared/sdk/subscribe/UserVisits/UserVisitsProcessor.ts
import { Comment } from '@onecomme.com/onesdk/types/Comment'
import { ServiceAPI } from '../../service/ServiceAPI'
import { ServiceVisitType } from '../../../types/subscribe/UserVisitSchema'
import { ServiceVisitManager } from './ServiceVisitManager'
import { UserDataProcessor } from './UserDataProcessor'

/**
 * ユーザー訪問データを処理するクラス
 */
export class UserVisitsProcessor {
  private userVisits: Record<string, ServiceVisitType> = {}
  private apiPoller: ServiceAPI
  private serviceManager: ServiceVisitManager
  private userProcessor: UserDataProcessor

  constructor() {
    this.apiPoller = ServiceAPI.getInstance()
    this.serviceManager = new ServiceVisitManager()
    this.userProcessor = new UserDataProcessor()
  }

  /**
   * 枠情報を自動更新(デフォルトで10秒毎)
   */
  startServicePolling(): void {
    this.apiPoller.startPolling((services) => {
      if (services) this.serviceManager.setFrames(services)
    })
  }

  /**
   * 既存の結果に新しいコメントを追加
   */
  mergeComments(comments: Comment[]): Record<string, ServiceVisitType> {
    const newVisits = this.createVisitsFromComments(comments)
    this.mergeVisits(newVisits)
    return this.userVisits
  }

  /**
   * 現在の結果を取得
   */
  getUserVisits(): Record<string, ServiceVisitType> {
    return this.userVisits
  }

  /**
   * リセット（ユーザーが明示的に実行）
   */
  reset(): void {
    this.userVisits = {}
  }

  /**
   * 特定のサービスのみリセット
   */
  resetService(serviceKey: string): void {
    delete this.userVisits[serviceKey]
  }

  /**
   * コメントから新しいユーザー訪問データを作成
   */
  private createVisitsFromComments(comments: Comment[]): Record<string, ServiceVisitType> {
    const visits: Record<string, ServiceVisitType> = {}

    for (const comment of comments) {
      if (!comment.data || !comment.meta) continue

      // サービスデータの初期化
      const initialized = this.serviceManager.initializeService(visits, comment)
      if (!initialized) continue

      this.serviceManager.attachFrameData(visits, comment.service)
      this.userProcessor.processUser(visits, comment)
    }

    return visits
  }

  /**
   * 既存の訪問データと新しい訪問データをマージ
   */
  private mergeVisits(newVisits: Record<string, ServiceVisitType>): void {
    for (const [serviceKey, newVisit] of Object.entries(newVisits)) {
      const existing = this.userVisits[serviceKey]

      if (!existing) {
        // 新規サービスはそのまま追加
        this.userVisits[serviceKey] = newVisit
        continue
      }

      // liveIdは最新のものに更新（データは保持）
      existing.liveId = newVisit.liveId

      // frameDataも更新
      if (newVisit.frameData) {
        existing.frameData = newVisit.frameData
      }

      // ユーザーデータのマージ
      this.userProcessor.mergeUserData(existing, newVisit)

      // 統計情報の更新
      this.serviceManager.updateStatistics(existing, newVisit)
    }
  }
}
