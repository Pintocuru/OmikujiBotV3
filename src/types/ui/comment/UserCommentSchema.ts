// src/types/ui/comment/UserCommentSchema.ts
import { z } from 'zod'

/**
 * ユーザーコメント UserComment
 * - おみくじ(イベント)が反応したコメントと、その結果を、レス風に縦に積んで表示する
 * - コメント本文は BotMessage の origin、結果は bubble.message から取る
 */
// 名前の表示のしかた
export const userCommentNameModes = ['userName', 'anonymous'] as const
export type UserCommentNameMode = (typeof userCommentNameModes)[number]

export const USER_COMMENT_MAX_ITEMS = 30 // maxItems の上限

export const UserCommentSchema = z.object({
  maxItems: z.number().int().min(1).max(USER_COMMENT_MAX_ITEMS).default(8).catch(8), // 同時に表示する件数(新しいものから)
  nameMode: z.enum(userCommentNameModes).default('userName').catch('userName'), // userName = ユーザー名 / anonymous = 名無しさん + ID
})
export type UserCommentType = z.infer<typeof UserCommentSchema>
