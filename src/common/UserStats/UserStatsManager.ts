// src/generator/stores/UserStats/UserStatsManager.ts
import { UserStatsRecord } from '@/types/api'
import { OmikenCommentType } from '@/types/OmikenComment'

type StatsEventListener = (record: UserStatsRecord) => void

/**
 * 配信全体のユーザー統計を管理するクラス
 * コメント受信のたびに更新され、lastVisit・liveComments を保持する
 */
export class UserStatsManager {
  private readonly stats = new Map<string, UserStatsRecord>()
  private readonly listeners = new Set<StatsEventListener>()
  private readonly changeListeners = new Set<() => void>()

  // コメントを受け取った時に呼び出す
  recordComment(omiken: OmikenCommentType): UserStatsRecord {
    const { userId, userName, profileImage, timestamp } = omiken
    const { tc, no } = omiken.meta
    const giftPrice = omiken.giftPrice ?? 0

    const existing = this.stats.get(userId)

    const record: UserStatsRecord = existing
      ? {
          ...existing,
          tc,
          no,
          timestamp,
          userName,
          profileImage,
          giftPrice: existing.giftPrice + giftPrice,
          lastVisit: timestamp,
        }
      : {
          userId,
          userName,
          profileImage,
          timestamp,
          tc,
          no,
          isSyoken: tc === 1,
          team: null,
          score: 0,
          tags: [],
          badges: [],
          giftPrice,
          lastVisit: timestamp,
        }

    this.stats.set(userId, record)
    this.notifyListeners(record)
    this.notifyChange()

    return record
  }

  // 記録をそのまま登録する (開発用のダミーユーザーなど。通常はコメントから recordComment で作る)
  upsert(record: UserStatsRecord): void {
    this.stats.set(record.userId, record)
    this.notifyChange()
  }

  // stats からランダムに 1 人を選出 (全員が同じ確率。全員をコピーして並べ替えることはしない)
  drawWinner(): { commenter: number; winner: UserStatsRecord | null } {
    const commenter = this.stats.size
    if (commenter === 0) return { commenter, winner: null }

    let index = Math.floor(Math.random() * commenter)
    for (const record of this.stats.values()) {
      if (index-- === 0) return { commenter, winner: record }
    }
    return { commenter, winner: null }
  }

  // 指定ユーザーの統計を取得
  get(userId: string): UserStatsRecord | null {
    return this.stats.get(userId) ?? null
  }

  // 全ユーザーの統計一覧を取得
  getAll(): UserStatsRecord[] {
    return Array.from(this.stats.values())
  }

  // ユーザー数取得
  getUniqueCount(): number {
    return this.stats.size
  }

  // 最新コメントユーザーを取得
  getLatest(): UserStatsRecord | null {
    let latest: UserStatsRecord | null = null
    for (const record of this.stats.values()) {
      if (!latest || record.lastVisit > latest.lastVisit) latest = record
    }
    return latest
  }

  // ユーザー統計を部分更新（score・team・tagsなど）
  update(userId: string, patch: Partial<UserStatsRecord>): UserStatsRecord | null {
    const existing = this.stats.get(userId)
    if (!existing) return null
    const updated = { ...existing, ...patch }
    this.stats.set(userId, updated)
    this.notifyChange()
    return updated
  }

  // 指定ユーザーを削除 (手動で追加したユーザーを消すときなど)
  remove(userId: string): boolean {
    const removed = this.stats.delete(userId)
    if (removed) this.notifyChange()
    return removed
  }

  // セッションリセット
  reset(): void {
    this.stats.clear()
    this.notifyChange()
  }

  // イベントリスナーを登録（解除用関数を返す）
  onUpdate(listener: StatsEventListener): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * 記録が変わったとき (コメント・更新・削除・リセット) に呼ばれるリスナーを登録する (解除用関数を返す)
   * onUpdate は「コメントで記録が作られた・更新された」だけの通知で、UserStatsControlSync が使う。
   * こちらは画面の再描画用で、UserStatsControlSync による更新も含む。
   */
  onChange(listener: () => void): () => void {
    this.changeListeners.add(listener)
    return () => this.changeListeners.delete(listener)
  }

  private notifyChange(): void {
    this.changeListeners.forEach((l) => l())
  }

  private notifyListeners(record: UserStatsRecord): void {
    // 1 つの購読者の失敗で、他の購読者への通知と、コメントの記録を止めない
    this.listeners.forEach((l) => {
      try {
        l(record)
      } catch (error) {
        console.error('[UserStatsManager] 更新通知の購読者でエラー:', error)
      }
    })
  }
}
