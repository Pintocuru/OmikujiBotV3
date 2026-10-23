// server/core/services/userListService.ts
// コメント由来のユーザーリスト。プラグイン (わんコメ) が受け取ったコメントから作る。
// generator と同じ UserStatsManager を、サーバー側にも1つ持つ (generator がなくても LiveConsole が使えるようにするため)。
import { UserStatsManager } from '@/generator/stores/UserStats/UserStatsManager'
import type { OmikenCommentType } from '@/types/OmikenComment'
import { POST_SETTINGS } from '@/sdk/PostSettings'
import type { UserStatsRecord } from '@/types/api'

const manager = new UserStatsManager()

/** コメントを1件記録する (プラグインの filterComment から呼ぶ) */
export function recordUserComment(omiken: OmikenCommentType): void {
  if (omiken.userId === POST_SETTINGS.botUserId) return // OmikujiBot 自身のコメントは、ユーザーとして数えない (generator と同じ)
  manager.recordComment(omiken)
}

/** コメント由来のユーザーを全件取得 */
export function getCommentUsers(): UserStatsRecord[] {
  return manager.getAll()
}

/**
 * コメント由来のユーザーを空にする (わんコメの「クリア」時など)
 * 手動の操作結果 (score / team / order) と、手動で追加したユーザーは残す
 */
export function resetCommentUsers(): void {
  manager.reset()
}

/** 開発用のダミーユーザーを登録する (わんコメがない Express の開発サーバー用) */
export function seedCommentUsers(users: UserStatsRecord[]): void {
  for (const user of users) manager.upsert({ ...user, score: 0 }) // score は操作結果が正なので、ダミーの値は使わない
}
