// src/console/games/scripts/mockGameLog.ts
// 開発サーバー用: ゲームの記録 (GameRanking が追記するログ) のテストデータを作る純粋関数
import { generateDummyMessages } from '@/common/MockUser'
import { GameLogSchema, type GameLogType } from '@/types/api'

/** 開発用に追加するログの既定の件数 */
export const MOCK_GAME_LOG_COUNT = 10

/** eventKey を選んでいないときに使う eventKey */
export const MOCK_EVENT_KEY = 'mock-ranking'

/**
 * 配信ID (StreamIdSchema: 英数字・_・- のみ) を日時から作る。例: '20261028-2130'
 * formatStreamId が読みやすく表示できる形式にそろえている
 */
export function buildMockStreamId(date = new Date()): string {
  const p = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}${p(date.getMonth() + 1)}${p(date.getDate())}-${p(date.getHours())}${p(date.getMinutes())}`
}

/**
 * ダミーのログを count 件作る
 * - ユーザーは名前で決まるので、何度か追加すると同じユーザーの記録が増える (「ユーザーごとに1件」の確認に使える)
 * - createdAt は 1秒ずつずらす (「新しい順」の確認に使える)
 */
export function buildMockGameLogs(count = MOCK_GAME_LOG_COUNT): GameLogType[] {
  const now = Date.now()
  return generateDummyMessages({ limit: count, sortOrder: 'new' }).map(({ user, slots }, index) =>
    GameLogSchema.parse({
      userId: user.userId,
      userName: user.userName,
      score: slots.score,
      item: slots.label,
      createdAt: now - (count - index) * 1000,
    })
  )
}
