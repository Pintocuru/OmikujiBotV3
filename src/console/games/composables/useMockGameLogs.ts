// src/console/composables/useMockGameLogs.ts
// 開発サーバー用: ゲームの記録にテストデータを追加する
// 本番 (わんコメのプラグイン) では GameRanking が append-game-log を呼ぶが、開発サーバーには呼び手がいないため、ここで代わりに呼ぶ
import { ref } from 'vue'
import { gameStateApi } from '@/manager/services/gameStateApi'
import { buildMockGameLogs, buildMockStreamId, MOCK_EVENT_KEY, MOCK_GAME_LOG_COUNT } from '../scripts/mockGameLog'

export function useMockGameLogs() {
  const adding = ref(false)
  const mockError = ref('')

  /**
   * テストデータを追加し、追加した配信の ID と eventKey を返す (失敗したら null)
   * - streamId / eventKey を選んでいればそこへ、なければ新しい配信 (日時のID) に追加する
   * - 同じ配信ファイルへの追記は、サーバーが順番に処理するため、1件ずつ送る
   */
  const addMockGameLogs = async (streamId: string | null, eventKey: string | null) => {
    if (adding.value) return null
    adding.value = true
    mockError.value = ''

    const targetStreamId = streamId ?? buildMockStreamId()
    const targetEventKey = eventKey ?? MOCK_EVENT_KEY
    try {
      for (const log of buildMockGameLogs(MOCK_GAME_LOG_COUNT)) {
        await gameStateApi.appendGameLog(targetStreamId, targetEventKey, log)
      }
      return { streamId: targetStreamId, eventKey: targetEventKey }
    } catch (error) {
      mockError.value = error instanceof Error ? error.message : String(error)
      return null
    } finally {
      adding.value = false
    }
  }

  return { adding, mockError, addMockGameLogs }
}
