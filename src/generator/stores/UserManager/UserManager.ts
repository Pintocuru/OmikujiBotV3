// src/generator/stores/UserManager/UserManager.ts
import { UserStatsManager } from './UserStatsManager'

/**
 * 配信セッションを管理するファサードクラス
 * - stats: 全体のユーザー統計（コメント数・チーム・スコアなど）
 */
export class UserManager {
  readonly stats = new UserStatsManager()
  private readonly sessionId: string

  constructor() {
    this.sessionId = this.generateSessionId()
  }

  getSessionId(): string {
    return this.sessionId
  }

  /**
   * セッションをリセット（新しい配信開始時などに使用）
   */
  resetSession(): void {
    this.stats.reset()
  }

  private generateSessionId(): string {
    const timestamp = Date.now()
    const randomSuffix = Math.random().toString(36).substring(2, 8)
    return `session_${timestamp}_${randomSuffix}`
  }
}
