// src/types/api/userStats/UserListSchema.ts
// LiveConsole が使うユーザーリスト (load-users) の型
// サーバーが、コメント由来のユーザーと、手動で追加したユーザーに、操作結果 (score / team など) を合わせて返す。
import { daisyUIColor } from '@/types/core'
import { z } from 'zod'

/**
 * ユーザーリストの1件
 * - isManual: 手動で追加したユーザー (コメントしていない人。userId は 'manual:' で始まる)
 * - score / team / order / tags / badges は、操作結果 (update-user-stats) の値
 */
export const UserListItemSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  profileImage: z.string().default(''),
  isManual: z.boolean().default(false),
  commentCount: z.number().default(0), // コメント数(総合)
  lastCommentAt: z.number().default(0), // 最後のコメントの時刻 (ms)。コメントしていなければ 0
  score: z.number().default(0),
  team: z.enum(daisyUIColor).nullable().default(null),
  order: z.number().nullable().default(null),
  tags: z.array(z.string()).default([]),
  badges: z.array(z.string()).default([]),
})
export type UserListItemType = z.infer<typeof UserListItemSchema>

/**
 * load-users: レスポンス
 */
export const UserListResponseSchema = z.object({
  revision: z.number(), // 操作結果のリビジョン
  users: z.array(UserListItemSchema),
})
export type UserListResponseType = z.infer<typeof UserListResponseSchema>

/**
 * add-manual-user: リクエスト / レスポンス
 */
export const AddManualUserRequestSchema = z.object({
  userName: z.string().trim().min(1).max(50),
})
export type AddManualUserRequestType = z.infer<typeof AddManualUserRequestSchema>

export const AddManualUserResponseSchema = z.object({
  userId: z.string(),
  revision: z.number(),
})
export type AddManualUserResponseType = z.infer<typeof AddManualUserResponseSchema>

/**
 * remove-manual-user: リクエスト
 */
export const RemoveManualUserRequestSchema = z.object({
  userId: z.string().min(1),
})
export type RemoveManualUserRequestType = z.infer<typeof RemoveManualUserRequestSchema>
