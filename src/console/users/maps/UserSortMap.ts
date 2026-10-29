// src/console/users/maps/UserSortMap.ts
// ユーザーリストの並び替えの種類と表示名 (ピン留めしたユーザーは、どの並びでも先頭)
import type { UserSortKey } from '@/console/types'

export const userSortLabels: Record<UserSortKey, string> = {
  recent: 'コメントが新しい順',
  score: '得点が高い順',
  name: '名前順',
}
