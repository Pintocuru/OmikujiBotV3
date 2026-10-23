// src/ui/UserBoard/composables/useUserStatsList.ts
import { onScopeDispose, shallowRef } from 'vue'
import { useAppStore } from '@/generator/stores/useAppStore'
import type { UserStatsRecord } from '@/types/api'

/**
 * generator の UserStatsManager のユーザー一覧を、画面で使える形 (変わると再描画される) で返す
 * - コメント・LiveConsole の操作の取り込み・リセットで一覧が変わるたびに更新する
 * - まとめて何件も変わったとき (ポーリングで複数ユーザーを更新するなど) は、1回の再描画にまとめる
 */
export function useUserStatsList() {
  const { userStats } = useAppStore()
  const users = shallowRef<UserStatsRecord[]>(userStats.getAll())

  let scheduled = false
  const stop = userStats.onChange(() => {
    if (scheduled) return
    scheduled = true
    queueMicrotask(() => {
      scheduled = false
      users.value = userStats.getAll()
    })
  })
  onScopeDispose(stop)

  return users
}
