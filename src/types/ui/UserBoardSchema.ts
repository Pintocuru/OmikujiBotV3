// src/types/ui/UserBoardSchema.ts
import { normalizedObject } from '../core'
import { CharacterColorScheme } from '../OmikujiData/assets/CharacterSchema'
import { z } from 'zod'

/**
 * ユーザーボード UserBoard
 * LiveConsole で操作した、ユーザーの得点・チームを表示する
 */
// UserBoard のコンポーネントセット
// - ranking: 個人の得点リスト (得点の高い順)
// - teamBar: チームの得点 (チーム色ごとのバーで、得点の差を見せる)
// - teamScore: チームの得点 (チーム色ごとの大きな得点を、横に並べるスコアボード)
export const boardComponentSets = {
  standard: ['ranking', 'teamBar', 'teamScore'],
} as const

export type BoardComponentSets = typeof boardComponentSets
export type BoardComponentSet = keyof BoardComponentSets

// セット別の ID 型
export type BoardComponentOf<S extends BoardComponentSet> = BoardComponentSets[S][number]

// 全 ID
export type BoardComponent = BoardComponentOf<BoardComponentSet>

export const UserBoardSchema = z.object({
  component: z.string().min(1).default('ranking').catch('ranking'), // 表示するコンポーネント(保存データは文字列。未同梱の ID も保持する。空文字は ranking に戻す)
  color: normalizedObject(CharacterColorScheme, 'ui.UserBoard.color'),
  limit: z.number().min(1).max(30).default(10).catch(10), // ranking の表示件数
})
export type UserBoardType = z.infer<typeof UserBoardSchema>
