// src/maps/ui/UserBoardMap.ts
import type { UserBoardKind } from '@/types/ui'

/**
 * ユーザーボード UserBoard
 */
export const userBoardMap: Record<UserBoardKind, { label: string; description: string }> = {
  ranking: { label: '個人ランキング', description: '得点の高い順に、ユーザーを表示します' },
  team: { label: 'チーム合計', description: 'チーム色ごとの合計得点を、バーで表示します' },
  seats: { label: '席順', description: '席順の小さい順に、ユーザーを並べて表示します' },
}
