// src/ui/LuckyDraw/types.ts
import type { UserNameType } from '@/types/OmikenComment'

/** 履歴 1 件(抽選 1 回分の当選者) */
export type LuckyDrawHistoryItem = {
  id: string
  timestamp: number
  users: UserNameType[]
}

/** 表示コンポーネントに渡す抽選の状態 */
export type LuckyDrawState = {
  isVisible: boolean // 結果を表示するか(抽選後、displaySeconds の間)
  winners: UserNameType[] // 当選者(抽選前は空)
  drawKey: number // 抽選のたびに増える(登場アニメーションをやり直すため)
  hasDrawn: boolean // 抽選済みか(false なら「待機中」の表示)
  participantCount: number // 現在の参加者数
}
