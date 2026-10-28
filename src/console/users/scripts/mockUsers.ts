// src/console/scripts/mockUsers.ts
// 開発サーバー用: コメント由来のユーザーのテストデータを作る純粋関数
import { generateDummyUserStats } from '@/common/MockUser'
import type { UserStatsRecord } from '@/types/api'

/** 開発用に1回で追加するユーザーの人数 */
export const MOCK_USER_COUNT = 30

/**
 * ダミーのユーザーを count 人作る
 * generateDummyUserStats の userId は呼び出しごとに連番が振り直されるため、同じ名前が出ると前回のユーザーと同じ ID になる。
 * 追加するたびにユーザーが増えるよう、追加の単位 (batch) を userId に足している
 */
export function buildMockUsers(count = MOCK_USER_COUNT): UserStatsRecord[] {
  const batch = Date.now().toString(36)
  return generateDummyUserStats(count).map((user) => ({ ...user, userId: `${user.userId}-${batch}` }))
}
