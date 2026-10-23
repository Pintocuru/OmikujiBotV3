// src/generator/stores/UserStats/startUserStatsPolling.ts
import { userStatsApi } from '@/manager/services/userStatsApi'
import type { UserStatsControlSync } from './UserStatsControlSync'

// Pinia ストア経由だと private メンバーが型に合わなくなるため、必要なメンバーだけで受ける
type UserStatsSync = Pick<UserStatsControlSync, 'revision' | 'apply' | 'restoreManualUsers'>

const DEFAULT_INTERVAL_MS = 3000

/**
 * サーバーの操作結果 (load-user-stats) を、前回の revision 付きでポーリングして取り込む
 * - サーバー (プラグイン) がない・つながらないときは、静かに無視して、次の周期でもう一度試す
 * - 戻り値は、ポーリングを止める関数
 */
export function startUserStatsPolling(sync: UserStatsSync, intervalMs = DEFAULT_INTERVAL_MS): () => void {
  let running = false // 前回の取得が終わる前に、次を始めない

  const tick = async () => {
    if (running) return
    running = true
    try {
      sync.apply(await userStatsApi.loadUserStats(sync.revision))
      sync.restoreManualUsers()
    } catch {
      // サーバーがない (OBS のみで使っているなど) ときは何もしない
    } finally {
      running = false
    }
  }

  void tick()
  const timer = setInterval(() => void tick(), intervalMs)
  return () => clearInterval(timer)
}
