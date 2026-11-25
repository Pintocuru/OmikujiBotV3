// src/console/game/WordAlchemy/scripts/discoveryLog.ts
// 発見をゲームログ (GameLog) に残す記録の組み立て (純粋関数)。ユーザーの得点 (update-user-stats) は変えない
import type { GameLogType } from '@/types/api'

/** ゲームログの eventKey (1 配信 = 1 ファイルの中の、この名前の GameState に残る) */
export const WORD_ALCHEMY_EVENT_KEY = 'wordAlchemy'
/** 発見の貢献点 (材料を出したユーザーに、1 人ずつ付く)。新種を出した人ほど高い */
export const DISCOVERY_SCORE = { new: 3, known: 1 } as const

/**
 * 材料を出したユーザー全員ぶんのログを 1 件ずつ作る (同じユーザーが複数の材料を出していても、1 件)
 * - score: 貢献点 (新種 3 / 既発見 1)
 * - item: 表示用 (完成品の名前。新種なら「(新種)」付き)
 * - flag: 新種か
 * - id: 煮込みごとの ID + userId。同じ内容を再送しても、サーバーが二重に保存しない
 */
export const buildDiscoveryLogs = (found: {
  discoveryId: string
  name: string
  isNew: boolean
  users: readonly { userId: string; userName: string }[]
  createdAt: number
}): GameLogType[] => {
  const unique = new Map<string, string>()
  for (const user of found.users) if (!unique.has(user.userId)) unique.set(user.userId, user.userName)
  return [...unique].map(([userId, userName]) => ({
    id: `${found.discoveryId}:${userId}`,
    userId,
    userName,
    score: found.isNew ? DISCOVERY_SCORE.new : DISCOVERY_SCORE.known,
    item: found.isNew ? `${found.name}(新種)` : found.name,
    flag: found.isNew,
    createdAt: found.createdAt,
  }))
}
