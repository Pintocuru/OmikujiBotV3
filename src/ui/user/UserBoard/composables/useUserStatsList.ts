// src/ui/user/UserBoard/composables/useUserStatsList.ts
import { computed } from 'vue'
import { useAppStore } from '@/generator/stores/useAppStore'

/**
 * generator の UserStatsManager のユーザー一覧を、画面で使える形 (変わると再描画される) で返す
 * UserStatsManager の保存先がリアクティブなので、コメント・LiveConsole の操作の取り込み・リセットのどれでも、
 * 一覧が変わると自動で更新される (通知の購読は要らない)。
 * まとめて何件も変わっても、再描画は Vue が 1 回にまとめる。
 */
export function useUserStatsList() {
  const { userStats } = useAppStore()
  return computed(() => userStats.getAll())
}
