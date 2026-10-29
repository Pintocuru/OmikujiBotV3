// src/maps/ui/UserBoardMap.ts
import type { UserBoardComponent } from '@/types/ui'

/**
 * ユーザーボード UserBoard
 */
export const userBoardComponentMap: Record<UserBoardComponent, { label: string; description: string }> = {
  ranking: { label: '個人の得点リスト', description: '得点の高い順に、ユーザーを表示します' },
  teamBar: {
    label: 'チームの得点(バー)',
    description: 'チーム色ごとの合計得点を、バーの長さで比べられるように表示します',
  },
  teamScore: {
    label: 'チームの得点(スコアボード)',
    description: 'チーム色ごとの合計得点を、大きな数字で横に並べて表示します',
  },
}
