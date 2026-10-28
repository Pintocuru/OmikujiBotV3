// src/console/composables/useMockUsers.ts
// 開発サーバー用: コメント由来のテスト用ユーザーを追加する
// 本番 (わんコメのプラグイン) ではコメントでユーザーが増えるが、開発サーバーにはコメントが来ないため、ここで代わりに追加する
import { ref } from 'vue'
import { userStatsApi } from '@/manager/services/userStatsApi'
import { buildMockUsers, MOCK_USER_COUNT } from '../scripts/mockUsers'

export function useMockUsers() {
  const adding = ref(false)
  const mockError = ref('')

  /** テスト用ユーザーを追加する (成功したら true) */
  const addMockUsers = async (): Promise<boolean> => {
    if (adding.value) return false
    adding.value = true
    mockError.value = ''
    try {
      await userStatsApi.seedMockUsers(buildMockUsers(MOCK_USER_COUNT))
      return true
    } catch (error) {
      mockError.value = error instanceof Error ? error.message : String(error)
      return false
    } finally {
      adding.value = false
    }
  }

  return { adding, mockError, addMockUsers }
}
