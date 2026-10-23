// src/types/ui/UserBoardSchema.ts
import { normalizedObject } from '../core'
import { CharacterColorScheme } from '../OmikujiData/assets/CharacterSchema'
import { z } from 'zod'

/**
 * ユーザーボード UserBoard
 * LiveConsole で操作した、ユーザーの得点・チーム・席順を表示する (表示名は src/maps/ui/UserBoardMap.ts)
 * - ranking: 個人ランキング (得点の高い順)
 * - team: チーム合計 (チーム色ごとのバー)
 * - seats: 席順 (席順の小さい順)
 */
export const userBoards = ['ranking', 'team', 'seats'] as const
export type UserBoardKind = (typeof userBoards)[number]

export const UserBoardSchema = z.object({
  board: z.enum(userBoards).default('ranking').catch('ranking'),
  color: normalizedObject(CharacterColorScheme),
  limit: z.number().min(1).max(30).default(10).catch(10), // ranking / seats の表示件数
})
export type UserBoardType = z.infer<typeof UserBoardSchema>
