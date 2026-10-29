// src/types/ui/UserBoardSchema.ts
import { normalizedObject } from '../core'
import { CharacterColorScheme } from '../OmikujiData/assets/CharacterSchema'
import { z } from 'zod'

/**
 * ユーザーボード UserBoard
 * LiveConsole で操作した、ユーザーの得点・チームを表示する
 */
// コンポーネントの選択肢(表示名は src/maps/ui/UserBoardMap.ts)
// - ranking: 個人の得点リスト (得点の高い順)
// - teamBar: チームの得点 (チーム色ごとのバーで、得点の差を見せる)
// - teamScore: チームの得点 (チーム色ごとの大きな得点を、横に並べるスコアボード)
export const userBoardComponents = ['ranking', 'teamBar', 'teamScore'] as const
export type UserBoardComponent = (typeof userBoardComponents)[number]

export const UserBoardSchema = z.object({
  component: z.enum(userBoardComponents).default('ranking').catch('ranking'), // 表示するコンポーネント
  color: normalizedObject(CharacterColorScheme),
  limit: z.number().min(1).max(30).default(10).catch(10), // ranking の表示件数
})
export type UserBoardType = z.infer<typeof UserBoardSchema>
